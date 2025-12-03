import partnerA from "@/data/partnerA.json";
import partnerB from "@/data/partnerB.json";

export type PartnerConfig = typeof partnerA;

const partners: Record<string, PartnerConfig> = {
  [partnerA.id]: partnerA,
  [partnerB.id]: partnerB,
};

export function listPartners(): PartnerConfig[] {
  return Object.values(partners);
}

export function getPartner(id: string): PartnerConfig {
  return partners[id] ?? partnerA;
}
