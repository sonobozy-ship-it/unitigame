using System.Linq;
using UnityEngine;

public class ProjectSystem : MonoBehaviour
{
    [SerializeField] private ContractDefinition[] _allContracts;

    private const float TICKS_PER_DAY = 30f;

    // ──────────────────────────────────────────────
    public void ProcessTick(GameState state)
    {
        var p = state.CurrentProject;
        if (p == null || p.Phase == ProjectPhase.Completed) return;

        switch (p.Phase)
        {
            case ProjectPhase.Procurement:
                ProcessProcurement(p, state);
                break;
            case ProjectPhase.Construction:
            case ProjectPhase.Finishing:
                ProcessBuilding(p, state);
                break;
            case ProjectPhase.Documents:
                // Documents are player-triggered, just add deadline pressure
                AddDeadlinePressure(p, state);
                break;
            case ProjectPhase.WaitingPayment:
                // Payment handled in FinanceSystem
                break;
        }

        // Deadline pressure (common to all phases)
        var daysLeft = p.DeadlineDay - state.Day;
        if (daysLeft <= 3 && daysLeft > 0)
        {
            state.Stress = Mathf.Min(100, state.Stress + 0.5f);
            if (state.Tick % 30 == 0)
                GameManager.Instance.AddLog($"⏰ {p.Client} звонит каждый час. До дедлайна {daysLeft} дн.");
        }
        else if (daysLeft < 0)
        {
            state.Stress = Mathf.Min(100, state.Stress + 1f);
            p.AccruedPenalties += CalculateDailyPenalty(p);
            if (state.Tick % 30 == 0)
                GameManager.Instance.AddLog($"💸 Просрочка. Штраф за сегодня: {CalculateDailyPenalty(p):N0} ₽.");
        }
    }

    private void ProcessProcurement(ProjectState p, GameState state)
    {
        // Procurement completes automatically over some ticks
        p.PhaseProgress += 5f;
        if (p.PhaseProgress >= 100)
        {
            p.Phase = ProjectPhase.Construction;
            p.PhaseProgress = 0;
            GameManager.Instance.AddLog($"🚚 Материалы доставлены. Бригада выезжает на {p.Name}.");
        }
    }

    private void ProcessBuilding(ProjectState p, GameState state)
    {
        var activeWorkers = state.HiredWorkers
            .Where(w => !w.IsOnBinge && !w.IsOnAnotherSite)
            .ToList();

        if (activeWorkers.Count == 0) return;

        var totalEff = activeWorkers.Sum(w => w.Efficiency);

        // Foreman bonus: reduces inefficiency
        var hasForeman = activeWorkers.Any(w => w.WorkerId == "petrovich_foreman");
        if (hasForeman) totalEff *= 1.2f;

        var progressPerTick = totalEff / 50f;
        p.Progress = Mathf.Min(100, p.Progress + progressPerTick);

        // Advance phase
        if (p.Phase == ProjectPhase.Construction && p.Progress >= 70)
        {
            p.Phase = ProjectPhase.Finishing;
            GameManager.Instance.AddLog($"🏗️ Основные работы завершены. Переходим к отделке.");
        }

        if (p.Progress >= 100)
        {
            p.Phase = ProjectPhase.Documents;
            p.PhaseProgress = 0;
            GameManager.Instance.AddLog($"✅ {p.Name} — работы завершены! Собираем ИД...");
        }
    }

    private void AddDeadlinePressure(ProjectState p, GameState state)
    {
        var daysLeft = p.DeadlineDay - state.Day;
        if (daysLeft < 0)
        {
            state.Stress = Mathf.Min(100, state.Stress + 0.2f);
        }
    }

    private long CalculateDailyPenalty(ProjectState p)
    {
        // Typical construction contract: 0.1% per day of delay
        return (long)(p.ContractValue * 0.001f);
    }

    // ──────────────────────────────────────────────
    public void StartProject(string contractId, GameState state)
    {
        var def = GetContract(contractId);
        if (def == null) return;

        var advance = (long)(def.ContractValue * def.AdvancePercent);

        // Pay for materials upfront
        if (state.Money < def.MaterialsCost)
        {
            GameManager.Instance.AddLog($"❌ Недостаточно средств на закупку материалов.");
            return;
        }
        state.Money -= def.MaterialsCost;
        state.Money += advance;

        var docIterations = UnityEngine.Random.Range(def.DocumentIterationsMin, def.DocumentIterationsMax + 1);

        // Document specialist reduces iterations
        var hasDocSpec = state.HiredWorkers.Any(w => w.WorkerId == "doc_specialist");
        if (hasDocSpec) docIterations = Mathf.Max(1, docIterations - 1);

        state.CurrentProject = new ProjectState
        {
            ContractId = contractId,
            Name = def.ContractName,
            Client = def.Client,
            ClientType = def.ClientType,
            Emoji = def.Emoji,
            ContractValue = def.ContractValue,
            AdvancePaid = advance,
            ClientMood = def.ClientMoodStart,
            StartDay = state.Day,
            DeadlineDay = state.Day + def.DurationDays,
            EventMultiplier = def.EventMultiplier,
            DocumentMaxIterations = docIterations,
        };

        AnalyticsManager.Track("contract_started", ("id", contractId), ("value", def.ContractValue));
        GameManager.Instance.AddLog($"🤝 Контракт подписан: {def.ContractName}. Аванс: {advance:N0} ₽. Дедлайн: день {state.Day + def.DurationDays}.");
    }

    public void SignKS2(GameState state)
    {
        var p = state.CurrentProject;
        if (p == null || p.Phase != ProjectPhase.SigningKS2) return;

        p.Ks2Signed = true;

        // Calculate final payment amount
        var remaining = p.ContractValue - p.AdvancePaid + p.ExtraRevenue - p.AccruedPenalties;
        var moodMultiplier = Mathf.Lerp(0.6f, 1.0f, p.ClientMood / 100f);
        var finalAmount = (long)(remaining * moodMultiplier);

        // Payment delay based on client type
        var delayTicks = GetPaymentDelayTicks(p.ClientType);

        var payment = new PendingPayment
        {
            ProjectName = p.Name,
            Client = p.Client,
            Amount = finalAmount,
            ArrivalTick = state.Tick + delayTicks,
            ArrivalTickOriginal = state.Tick + delayTicks,
        };

        state.PendingPayments.Add(payment);
        p.Phase = ProjectPhase.WaitingPayment;

        var delayMinutes = delayTicks / 60f;
        var delayText = delayTicks < 120
            ? $"{delayTicks} сек"
            : delayMinutes < 60 ? $"{delayMinutes:F0} мин" : $"{delayMinutes / 60f:F1} ч";

        GameManager.Instance.AddLog($"📝 КС-2 подписан! Оплата {finalAmount:N0} ₽ ожидается через {delayText}.");

        if (p.ClientType == "goszakaz")
            GameManager.Instance.AddLog("🏛️ КАЗНАЧЕЙСТВО: принято к рассмотрению. Сроки — как повезёт.");

        AnalyticsManager.Track("ks2_signed", ("project", p.Name), ("amount", finalAmount));
    }

    private int GetPaymentDelayTicks(string clientType) => clientType switch
    {
        "normal"     => UnityEngine.Random.Range(30, 90),     // 30s–90s (fast)
        "toxic"      => UnityEngine.Random.Range(120, 300),   // 2–5 min
        "genpodryad" => UnityEngine.Random.Range(180, 600),   // 3–10 min
        "goszakaz"   => UnityEngine.Random.Range(600, 3600),  // 10 min – 1 hour (retention king)
        _            => 60,
    };

    public void FinalizeProject(GameState state)
    {
        var p = state.CurrentProject;
        if (p == null) return;

        var repDelta = Mathf.RoundToInt((p.ClientMood - 50f) / 10f);
        state.Reputation = Mathf.Clamp(state.Reputation + repDelta, 0, 100);
        state.Stress = Mathf.Max(0, state.Stress - 10);

        var record = new CompletedProjectRecord
        {
            Name = p.Name,
            Client = p.Client,
            Emoji = p.Emoji,
            Earned = p.ContractValue, // simplified
            CompletedDay = state.Day,
            FinalClientMood = p.ClientMood,
            DocumentRejections = p.DocumentRejections,
        };

        state.CompletedProjects.Insert(0, record);
        state.CurrentProject = null;

        // Check progression unlocks
        GameManager.Instance.Progression.CheckUnlocks(state);
        AnalyticsManager.Track("project_completed", ("name", p.Name), ("mood", p.ClientMood));
    }

    public ContractDefinition GetContract(string id)
    {
        foreach (var c in _allContracts)
            if (c.Id == id) return c;
        return null;
    }

    public ContractDefinition[] GetAvailableContracts(GameState state)
    {
        return System.Array.FindAll(_allContracts, c =>
            state.UnlockedContractIds.Contains(c.Id) &&
            c.RequiredCompanyLevel <= state.CompanyLevel &&
            c.RequiredReputation <= state.Reputation);
    }
}
