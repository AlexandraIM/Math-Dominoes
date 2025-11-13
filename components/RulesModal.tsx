
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const RulesModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const howToPlayPoints = t('howToPlayPoints') as unknown as string[];
  const winningPoints = t('winningPoints') as unknown as string[];


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="rules-title">
      <div className="bg-[#f5e6d3] text-[#2f3e46] p-8 rounded-2xl shadow-2xl max-w-2xl w-full border-2 border-[#83c5be]/50 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-4xl font-light text-[#52796f] hover:text-[#83c5be]" aria-label="Close rules">&times;</button>
        <h2 id="rules-title" className="text-3xl font-bold text-[#52796f] mb-6 text-center">{t('rulesTitle')}</h2>
        <div className="space-y-4 text-base md:text-lg text-left overflow-y-auto max-h-[70vh] pr-4">
          <h3 className="font-bold text-[#83c5be]">{t('objectiveHeader')}</h3>
          <p>{t('objectiveText')}</p>

          <h3 className="font-bold text-[#83c5be]">{t('howToPlayHeader')}</h3>
          <ul className="list-disc list-inside space-y-2">
            {howToPlayPoints.map((point, index) => <li key={index}>{point}</li>)}
          </ul>

          <h3 className="font-bold text-[#83c5be]">{t('winningHeader')}</h3>
          <ul className="list-disc list-inside space-y-2">
            {winningPoints.map((point, index) => <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;