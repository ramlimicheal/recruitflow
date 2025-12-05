/**
 * Localization utilities for Indian market
 */

export type Language = 'en' | 'hi';
export type Currency = 'USD' | 'INR';

// Hindi translations for key UI terms
export const translations = {
    en: {
        dashboard: 'Dashboard',
        pipeline: 'Pipeline',
        tasks: 'Tasks',
        candidates: 'Candidates',
        interviews: 'Interviews',
        clients: 'Clients',
        documents: 'Documents',
        settings: 'Settings',
        activity: 'Activity Feed',
        logout: 'Logout',
        addCandidate: 'Add Candidate',
        viewDetails: 'View Details',
        schedule: 'Schedule',
        complete: 'Complete',
        pending: 'Pending',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        revenue: 'Revenue',
        placements: 'Placements',
        active: 'Active',
        salary: 'Salary',
        fee: 'Fee'
    },
    hi: {
        dashboard: 'डैशबोर्ड',
        pipeline: 'पाइपलाइन',
        tasks: 'कार्य',
        candidates: 'उम्मीदवार',
        interviews: 'साक्षात्कार',
        clients: 'ग्राहक',
        documents: 'दस्तावेज़',
        settings: 'सेटिंग्स',
        activity: 'गतिविधि फ़ीड',
        logout: 'लॉग आउट',
        addCandidate: 'उम्मीदवार जोड़ें',
        viewDetails: 'विवरण देखें',
        schedule: 'अनुसूची',
        complete: 'पूर्ण',
        pending: 'लंबित',
        high: 'उच्च',
        medium: 'मध्यम',
        low: 'निम्न',
        revenue: 'राजस्व',
        placements: 'नियुक्तियां',
        active: 'सक्रिय',
        salary: 'वेतन',
        fee: 'शुल्क'
    }
};

/**
 * Get translated text
 */
export const translate = (key: keyof typeof translations.en, language: Language = 'en'): string => {
    return translations[language][key] || translations.en[key];
};

/**
 * Format salary in LPA (Lakhs Per Annum) for Indian market
 */
export const formatLPA = (annualSalary: number): string => {
    const lakhs = annualSalary / 100000;
    return `₹${lakhs.toFixed(2)} LPA`;
};

/**
 * Convert USD to INR (using approximate rate)
 */
export const convertUSDtoINR = (usd: number, rate: number = 83): number => {
    return usd * rate;
};

/**
 * Format currency based on preference
 */
export const formatCurrency = (amount: number, currency: Currency = 'USD'): string => {
    if (currency === 'INR') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(amount);
};

/**
 * Format salary display based on currency preference
 */
export const formatSalary = (annualSalary: number, currency: Currency = 'USD'): string => {
    if (currency === 'INR') {
        return formatLPA(annualSalary);
    }
    return formatCurrency(annualSalary, currency);
};

export default {
    translate,
    formatLPA,
    convertUSDtoINR,
    formatCurrency,
    formatSalary
};
