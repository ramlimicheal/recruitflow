/**
 * Indian compliance utilities for GST and TDS calculations
 */

export interface GSTCalculation {
    baseAmount: number;
    gstRate: number;
    gstAmount: number;
    totalAmount: number;
}

export interface TDSCalculation {
    grossAmount: number;
    tdsRate: number;
    tdsAmount: number;
    netAmount: number;
}

export interface InvoiceData {
    invoiceNumber: string;
    date: string;
    clientName: string;
    clientGSTIN?: string;
    serviceDescription: string;
    baseAmount: number;
    gst: GSTCalculation;
    tds?: TDSCalculation;
    finalAmount: number;
}

/**
 * Calculate GST (Goods and Services Tax)
 * Standard rate for recruitment services in India is 18%
 */
export const calculateGST = (baseAmount: number, gstRate: number = 18): GSTCalculation => {
    const gstAmount = (baseAmount * gstRate) / 100;
    const totalAmount = baseAmount + gstAmount;

    return {
        baseAmount,
        gstRate,
        gstAmount,
        totalAmount
    };
};

/**
 * Calculate TDS (Tax Deducted at Source)
 * Standard rate for professional services is 10%
 */
export const calculateTDS = (grossAmount: number, tdsRate: number = 10): TDSCalculation => {
    const tdsAmount = (grossAmount * tdsRate) / 100;
    const netAmount = grossAmount - tdsAmount;

    return {
        grossAmount,
        tdsRate,
        tdsAmount,
        netAmount
    };
};

/**
 * Generate invoice data with GST and TDS
 */
export const generateInvoice = (
    clientName: string,
    serviceDescription: string,
    baseAmount: number,
    options: {
        clientGSTIN?: string;
        applyTDS?: boolean;
        gstRate?: number;
        tdsRate?: number;
    } = {}
): InvoiceData => {
    const {
        clientGSTIN,
        applyTDS = false,
        gstRate = 18,
        tdsRate = 10
    } = options;

    // Calculate GST
    const gst = calculateGST(baseAmount, gstRate);

    // Calculate TDS if applicable
    let tds: TDSCalculation | undefined;
    let finalAmount = gst.totalAmount;

    if (applyTDS) {
        tds = calculateTDS(gst.totalAmount, tdsRate);
        finalAmount = tds.netAmount;
    }

    // Generate invoice number (format: INV-YYYYMMDD-XXX)
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const invoiceNumber = `INV-${dateStr}-${randomNum}`;

    return {
        invoiceNumber,
        date: date.toISOString().split('T')[0],
        clientName,
        clientGSTIN,
        serviceDescription,
        baseAmount,
        gst,
        tds,
        finalAmount
    };
};

/**
 * Format GST number (GSTIN format: 22AAAAA0000A1Z5)
 */
export const formatGSTIN = (gstin: string): string => {
    return gstin.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

/**
 * Validate GSTIN format
 */
export const validateGSTIN = (gstin: string): boolean => {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin.toUpperCase());
};

export default {
    calculateGST,
    calculateTDS,
    generateInvoice,
    formatGSTIN,
    validateGSTIN
};
