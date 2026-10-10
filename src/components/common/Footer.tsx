import React from 'react';
import { AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-20 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold tracking-tight text-white">
                CondoCompass <span className="text-teal-400">SG</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-md leading-relaxed mb-4">
              Singapore’s first-time condominium buyer intelligence platform. Built to guide informed, prudent housing decisions through quantitative affordability modeling, lifestyle accessibility scoring, and realistic 4-year resale simulation.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>DEMO DATA NOTICE: All sample properties, asking prices, and simulated scenarios are for educational illustration and do not constitute verified MLS listings or financial advice.</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3">
              Singapore Regulators
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a
                  href="https://www.iras.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>IRAS (Stamp Duties & Property Tax)</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mas.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>MAS (TDSR & LTV Guidelines)</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.cpf.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>CPF Board (Housing & Accrued Interest)</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ura.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>URA (Master Plan & REALIS Trends)</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3">
              Compliance & Caution
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed mb-3">
              Singapore property regulations, cooling measures, and tax brackets (BSD/ABSD/SSD) are subject to periodic statutory revisions. Always verify figures against current official government sources before executing property options.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-teal-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Complies with MAS 55% TDSR & Budget 2023 BSD Tiers</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            &copy; {new Date().getFullYear()} CondoCompass SG. Designed for Singapore First-Time Homebuyers.
          </div>
          <div className="flex items-center gap-4">
            <span>Currency: Singapore Dollars (S$)</span>
            <span>·</span>
            <span>Measurements: Square Feet (sq ft)</span>
            <span>·</span>
            <span>Holding Horizon: 4 Years</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
