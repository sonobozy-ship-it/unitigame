using System.Linq;
using UnityEngine;

public class FinanceSystem : MonoBehaviour
{
    private int _lastDailyProcessTick = -30;

    public void ProcessDailyCosts(GameState state)
    {
        if (state.HiredWorkers.Count == 0) return;

        var dailyCost = state.HiredWorkers.Sum(w => w.DailyCost);
        state.Money -= dailyCost;

        // Cash flow gap warning
        if (state.Money < 0)
        {
            state.Stress = Mathf.Min(100, state.Stress + 8);
            GameManager.Instance.AddLog($"🔴 Касса в минусе! Долг: {Mathf.Abs(state.Money):N0} ₽. Бригада ждёт денег.");
        }
        else if (state.Money < dailyCost * 3)
        {
            state.Stress = Mathf.Min(100, state.Stress + 2);
            GameManager.Instance.AddLog($"⚠️ Остаток кассы: {state.Money:N0} ₽ — хватит на {state.Money / dailyCost} дней.");
        }

        // Heavy debt = stress spiral
        if (state.Money < -500_000)
        {
            state.Stress = Mathf.Min(100, state.Stress + 15);
            GameManager.Instance.AddLog("💀 Долг критический. Поставщики угрожают. Рабочие в бунте.");
        }
    }

    public void ProcessPendingPayments(GameState state)
    {
        var arrived = state.PendingPayments.Where(p => state.Tick >= p.ArrivalTick).ToList();
        foreach (var payment in arrived)
        {
            state.Money += payment.Amount;
            state.TotalEarned += payment.Amount;
            state.Stress = Mathf.Max(0, state.Stress - 15);
            state.PendingPayments.Remove(payment);

            GameManager.Instance.AddLog($"💰 Оплата пришла! +{payment.Amount:N0} ₽ от {payment.Client}. Касса дышит.");

            // Finalize the project if payment was the last step
            if (state.CurrentProject?.Phase == ProjectPhase.WaitingPayment)
            {
                GameManager.Instance.Projects.FinalizeProject(state);
            }

            AnalyticsManager.Track("payment_received", ("amount", payment.Amount), ("client", payment.Client));
        }
    }

    /// <summary>
    /// Speed up the next pending payment. Called after rewarded ad or connections spend.
    /// </summary>
    public void SpeedUpPendingPayment(bool usedRewardedAd, GameState state)
    {
        var next = state.PendingPayments.OrderBy(p => p.ArrivalTick).FirstOrDefault();
        if (next == null) return;

        var reduction = usedRewardedAd ? 1800 : 600; // 30 min or 10 min in ticks
        next.ArrivalTick = Mathf.Max(state.Tick + 5, next.ArrivalTick - reduction);

        var text = usedRewardedAd ? "Позвонили в бухгалтерию" : "Связи задействованы";
        GameManager.Instance.AddLog($"📞 {text}. Оплата ускорена на {reduction / 60} мин.");
    }

    public void TakeMicroloan(long amount, GameState state)
    {
        var fee = (long)(amount * 0.15f); // 15% fee
        state.Money += amount;
        state.Debt += amount + fee;
        state.Stress = Mathf.Min(100, state.Stress + 5);
        GameManager.Instance.AddLog($"🏦 Взяли займ: {amount:N0} ₽. Вернуть с процентами: {amount + fee:N0} ₽.");
    }

    public long GetDailyBurn(GameState state) =>
        state.HiredWorkers.Sum(w => w.DailyCost);

    public int GetDaysOfRunway(GameState state)
    {
        var burn = GetDailyBurn(state);
        if (burn == 0) return 999;
        return Mathf.Max(0, (int)(state.Money / burn));
    }
}
