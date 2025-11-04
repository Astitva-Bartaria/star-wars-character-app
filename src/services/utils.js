import dayjs from "dayjs";

export function formatDateISOtoDDMMYYYY(iso) {
  try {
    return dayjs(iso).format("DD-MM-YYYY");
  } catch (e) {
    return iso;
  }
}

export function cmToMeters(cm) {
  if (!cm || cm === "unknown") return "unknown";
  const n = Number(cm);
  if (Number.isNaN(n)) return cm;
  return `${(n / 100).toFixed(2)} m`;
}

export function massToKg(mass) {
  if (!mass || mass === "unknown") return "unknown";
  return `${mass} kg`;
}
