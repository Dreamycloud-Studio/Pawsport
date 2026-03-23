export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  topic: string;
  urgent: boolean;
}

export function calculateTimeline(
  travelDate: string,
  requirements: string[]
): TimelineEvent[] {
  const travel = new Date(travelDate);
  const events: TimelineEvent[] = [];

  if (requirements.includes("rabies_vaccine")) {
    const vaccineDeadline = new Date(travel);
    vaccineDeadline.setDate(vaccineDeadline.getDate() - 180);
    events.push({
      id: "rabies-vaccine",
      title: "Rabies vaccination",
      description: "Must be administered at least 180 days before travel for titer test to be valid.",
      dueDate: vaccineDeadline.toISOString().split("T")[0],
      topic: "vaccine",
      urgent: daysUntil(vaccineDeadline) < 14,
    });
  }

  if (requirements.includes("health_certificate")) {
    const certDeadline = new Date(travel);
    certDeadline.setDate(certDeadline.getDate() - 10);
    events.push({
      id: "health-cert",
      title: "Health certificate",
      description: "Issued by accredited vet, valid within 10 days of travel.",
      dueDate: certDeadline.toISOString().split("T")[0],
      topic: "health_certificate",
      urgent: daysUntil(certDeadline) < 7,
    });
  }

  return events.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}
