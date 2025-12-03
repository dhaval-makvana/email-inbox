"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getPartner, listPartners, PartnerConfig } from "../lib/partner";

type Ctx = {
  partner: PartnerConfig;
  partners: PartnerConfig[];
  setPartnerId: (id: string) => void;
};

const PartnerContext = createContext<Ctx | undefined>(undefined);

export const PartnerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pList = listPartners();
  const [partner, setPartner] = useState<PartnerConfig>(pList[0]);

  useEffect(() => {
    // apply theme via data attribute on html element
    document.documentElement.setAttribute(
      "data-theme",
      partner.theme ?? "blue"
    );
  }, [partner]);

  const setPartnerId = (id: string) => {
    setPartner(getPartner(id));
  };

  return (
    <PartnerContext.Provider value={{ partner, partners: pList, setPartnerId }}>
      {children}
    </PartnerContext.Provider>
  );
};

export function usePartner() {
  const ctx = useContext(PartnerContext);
  if (!ctx) throw new Error("usePartner must be used inside PartnerProvider");
  return ctx;
}
