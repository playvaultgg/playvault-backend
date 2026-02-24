import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const styles = `
  .faq-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .faq-title {
    font-size: 2.5rem;
    font-weight: 800;
    text-align: center;
    margin-bottom: 3rem;
    color: #f4f4f4;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  
  .faq-title span {
      color: #d4af37;
  }

  .faq-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 1rem;
    background: #0a0a0a;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.05);
    overflow: hidden;
  }

  .faq-question {
    width: 100%;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: none;
    border: none;
    color: #f4f4f4;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    transition: all 0.3s ease;
  }

  .faq-question:hover {
    color: #d4af37;
    background: rgba(212,175,55,0.05);
  }

  .faq-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: #d4af37;
    flex-shrink: 0;
  }

  .faq-answer-container {
    overflow: hidden;
  }

  .faq-answer {
    padding: 0 1.5rem 1.5rem 1.5rem;
    color: #888;
    line-height: 1.6;
    font-size: 0.95rem;
  }
`;

const FAQItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="faq-item shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors duration-300">
            <button
                className="faq-question focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span className="pr-4">{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="faq-icon"
                >
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="faq-answer-container"
                    >
                        <div className="faq-answer">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "Are these game keys globally activated?",
            answer: "Yes, unless specifically stated on the product page as a Geo-locked item, all keys deployed via PlayVault are Global standard and can be redeemed on any valid account."
        },
        {
            question: "How long until I receive my digital key after scanning FamPay?",
            answer: "Instantaneous. Once the FamPay transaction encrypts successfully, our system intercepts the approval payload and deposits the alphanumeric key string directly into your User Vault and generates a receipt."
        },
        {
            question: "What platforms do your keys cover?",
            answer: "We supply primary stock codes for PC (Steam, Epic, GOG, EA), PlayStation Network, and Xbox Live infrastructure."
        },
        {
            question: "Are your games procured securely?",
            answer: "Affirmative. 100% of our digital injection stock is legally sourced from official publishers and vetted distributors. Trust badges are verified daily."
        },
    ];

    return (
        <div className="relative overflow-hidden py-10 w-full">
            <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-[#d4af37]/5 blur-[120px] pointer-events-none rounded-full"></div>
            <style>{styles}</style>
            <div className="faq-container relative z-10">
                <h2 className="faq-title font-black" style={{ fontFamily: 'Orbitron, sans-serif' }}>Intel <span>FAQ</span></h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
