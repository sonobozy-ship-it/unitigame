using System;
using System.Collections.Generic;

[Serializable]
public class GameState
{
    // Economy
    public long Money = 50_000;
    public long Debt = 0;
    public long TotalEarned = 0;
    public long Connections = 0; // "Связи" — premium currency

    // Meters (0–100)
    public float Stress = 0;
    public float Reputation = 50;

    // Time
    public int Day = 1;
    public int Tick = 0; // 1 tick = 1 real second

    // Projects
    public ProjectState CurrentProject = null;
    public List<CompletedProjectRecord> CompletedProjects = new();

    // Workers
    public List<HiredWorkerState> HiredWorkers = new();

    // Events
    public List<ActiveEventState> ActiveEvents = new();

    // Progression
    public int CompanyLevel = 1;
    public string CompanyName = "ИП Строй-Мастер";
    public HashSet<string> UnlockedContractIds = new() { "kvartira_ekonom" };
    public HashSet<string> UnlockedWorkerIds = new() { "vasya" };
    public HashSet<string> PurchasedUpgrades = new();

    // Log
    public List<LogEntry> Log = new();

    // State
    public bool IsGameOver = false;
    public long TotalDaysPlayed = 0;

    // Pending payments (retention mechanic)
    public List<PendingPayment> PendingPayments = new();
}

[Serializable]
public class ProjectState
{
    public string ContractId;
    public string Name;
    public string Client;
    public string ClientType; // "normal" | "toxic" | "goszakaz" | "genpodryad"
    public string Emoji;

    public long ContractValue;
    public long AdvancePaid;
    public long ExtraRevenue;         // from accepted change orders
    public long AccruedPenalties;     // штрафы за нарушения

    public float Progress;            // 0–100 overall
    public ProjectPhase Phase = ProjectPhase.Procurement;

    public float ClientMood;          // 0–100, affects payment multiplier
    public int StartDay;
    public int DeadlineDay;
    public float EventMultiplier = 1f;

    // Document system
    public bool DocumentsReady = false;
    public int DocumentRejections = 0;
    public int DocumentMaxIterations = 3;
    public List<string> RejectionReasons = new();

    // Payment tracking
    public bool Ks2Signed = false;
    public bool PaymentPending = false;
    public int PaymentArrivalTick = 0; // real-time tick when payment arrives

    // Phase progress (sub-progress within each phase)
    public float PhaseProgress = 0; // 0–100
}

public enum ProjectPhase
{
    Procurement,    // Закупка материалов
    Construction,   // Строительство
    Finishing,      // Доделка / отделка
    Documents,      // Сдача ИД
    SigningKS2,     // Подписание КС-2
    WaitingPayment, // Ожидание оплаты (retention hook)
    Completed,
}

[Serializable]
public class HiredWorkerState
{
    public string WorkerId;
    public string Name;
    public string Emoji;
    public float Efficiency;
    public long DailyCost;
    public float DrinkRisk;
    public float Quality;    // 0–1, reduces rework chance
    public float Reliability; // 0–1, reduces binge/leave risk

    public bool IsOnBinge = false;
    public int BingeTicksLeft = 0;
    public bool IsOnAnotherSite = false;
    public int AnotherSiteTicksLeft = 0;
}

[Serializable]
public class ActiveEventState
{
    public string EventId;
    public string InstanceId;
    public string Title;
    public string Description;
    public string Emoji;
    public int TicksLeft;
    public int AutoResolveOptionIndex;
    public List<EventOptionState> Options = new();
    public bool IsUrgent = false; // shows red border in UI
}

[Serializable]
public class EventOptionState
{
    public string Label;
    public long Cost;               // positive = player pays
    public float ProgressPenalty;
    public float StressDelta;
    public float ReputationDelta;
    public float ClientMoodDelta;
    public long ConnectionsCost;    // uses "Связи" resource
    public bool RequiresRewardedAd;
    public string Outcome;
}

[Serializable]
public class PendingPayment
{
    public string ProjectName;
    public string Client;
    public long Amount;
    public int ArrivalTick;        // when it lands
    public int ArrivalTickOriginal; // original ETA before ad reduction
}

[Serializable]
public class CompletedProjectRecord
{
    public string Name;
    public string Client;
    public string Emoji;
    public long Earned;
    public int CompletedDay;
    public float FinalClientMood;
    public int DocumentRejections;
}

[Serializable]
public class LogEntry
{
    public string Message;
    public int Tick;
}
