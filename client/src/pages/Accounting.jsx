import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FileText, Receipt, CreditCard, DollarSign, PieChart, Calculator, TrendingUp, Download, Plus, Search, Filter, ArrowUpRight, ArrowDownRight, Calendar, Building, User, X, Check, Send, Printer, Trash2, Eye, Edit2, MoreHorizontal, Mail, Clock, CheckCircle, AlertCircle, Banknote, Wallet, Activity, BarChart3 } from 'lucide-react';
import { accountingService } from '../services/api';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../components/Layout';

const AccountingPage = () => {
  const { isDark, currency, formatCurrency: formatCurrencyTheme } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  const [loading, setLoading] = useState(true);
  
  const getSection = () => {
    const pathLower = path.toLowerCase();
    if (pathLower.includes('/invoices')) return 'invoices';
    if (pathLower.includes('/bills')) return 'bills';
    if (pathLower.includes('/payments')) return 'payments';
    if (pathLower.includes('/expenses')) return 'expenses';
    if (pathLower.includes('/accounts')) return 'accounts';
    if (pathLower.includes('/reports')) return 'reports';
    if (pathLower.includes('/tax')) return 'tax';
    if (pathLower.includes('/customers')) return 'customers';
    return 'dashboard';
  };
  
  const section = getSection();
  const [activeSection, setActiveSection] = useState(getSection());
  const [searchQuery, setSearchQuery] = useState('');
  
  const [customers, setCustomers] = useState([
    { id: 'CUST-001', name: 'Acme Corporation', email: 'billing@acme.com', phone: '+1 555-0100', address: '123 Business Ave, New York, NY', totalInvoiced: 45000, outstanding: 15000, status: 'active' },
    { id: 'CUST-002', name: 'TechStart Inc', email: 'accounts@techstart.io', phone: '+1 555-0101', address: '456 Innovation Blvd, San Francisco, CA', totalInvoiced: 28500, outstanding: 8500, status: 'active' },
    { id: 'CUST-003', name: 'GlobalTech Solutions', email: 'ap@globaltech.com', phone: '+1 555-0102', address: '789 Tech Park, Austin, TX', totalInvoiced: 52000, outstanding: 24000, status: 'active' },
    { id: 'CUST-004', name: 'StartupXYZ', email: 'finance@startupxyz.co', phone: '+1 555-0103', address: '321 Startup Lane, Seattle, WA', totalInvoiced: 8500, outstanding: 3200, status: 'inactive' },
  ]);
  
  const [invoices, setInvoices] = useState([
    { id: 'INV-2024-001', customerId: 'CUST-001', customerName: 'Acme Corporation', items: [{ description: 'Enterprise License - Annual', quantity: 1, unitPrice: 12000 }, { description: 'Implementation Services', quantity: 10, unitPrice: 150 }], subtotal: 13500, tax: 1197, discount: 0, total: 14697, status: 'paid', createdAt: '2024-01-15', dueDate: '2024-02-15', paidAt: '2024-01-28', notes: 'Annual enterprise license' },
    { id: 'INV-2024-002', customerId: 'CUST-002', customerName: 'TechStart Inc', items: [{ description: 'Professional License - Monthly', quantity: 5, unitPrice: 99 }], subtotal: 495, tax: 44, discount: 0, total: 539, status: 'sent', createdAt: '2024-01-20', dueDate: '2024-02-20', paidAt: null, notes: '' },
    { id: 'INV-2024-003', customerId: 'CUST-003', customerName: 'GlobalTech Solutions', items: [{ description: 'Custom Development', quantity: 40, unitPrice: 175 }, { description: 'API Integration', quantity: 1, unitPrice: 2500 }], subtotal: 9500, tax: 843, discount: 500, total: 9843, status: 'overdue', createdAt: '2024-01-05', dueDate: '2024-02-05', paidAt: null, notes: 'Overdue - follow up required' },
    { id: 'INV-2024-004', customerId: 'CUST-004', customerName: 'StartupXYZ', items: [{ description: 'Starter Plan - 3 months', quantity: 1, unitPrice: 2400 }], subtotal: 2400, tax: 213, discount: 200, total: 2413, status: 'draft', createdAt: '2024-01-22', dueDate: '2024-02-22', paidAt: null, notes: '' },
    { id: 'INV-2024-005', customerId: 'CUST-001', customerName: 'Acme Corporation', items: [{ description: 'Premium Support Package', quantity: 1, unitPrice: 5000 }], subtotal: 5000, tax: 444, discount: 0, total: 5444, status: 'sent', createdAt: '2024-01-25', dueDate: '2024-02-25', paidAt: null, notes: 'Q1 Support package' },
  ]);
  
  const [expenses, setExpenses] = useState([
    { id: 'EXP-001', title: 'Figma Annual License', category: 'Software', amount: 540, vendor: 'Figma Inc', date: '2024-01-05', status: 'approved', receipt: true },
    { id: 'EXP-002', title: 'Client Meeting - NYC', category: 'Travel', amount: 850, vendor: 'Delta Airlines', date: '2024-01-08', status: 'approved', receipt: true },
    { id: 'EXP-003', title: 'Monthly Cleaning', category: 'Office', amount: 400, vendor: 'CleanPro Services', date: '2024-01-12', status: 'approved', receipt: true },
    { id: 'EXP-004', title: 'Google Ads Campaign', category: 'Marketing', amount: 2500, vendor: 'Google Ads', date: '2024-01-15', status: 'approved', receipt: false },
    { id: 'EXP-005', title: 'Slack Business+', category: 'Software', amount: 750, vendor: 'Slack Technologies', date: '2024-01-18', status: 'pending', receipt: true },
    { id: 'EXP-006', title: 'Internet - January', category: 'Utilities', amount: 199, vendor: 'Comcast Business', date: '2024-01-20', status: 'approved', receipt: true },
  ]);
  
  const [bills, setBills] = useState([
    { id: 'BILL-001', vendor: 'AWS Services', amount: 2500, status: 'paid', date: '2024-01-10', dueDate: '2024-02-10', category: 'Cloud Services' },
    { id: 'BILL-002', vendor: 'Office Supplies Co', amount: 890, status: 'pending', date: '2024-01-15', dueDate: '2024-02-15', category: 'Office' },
    { id: 'BILL-003', vendor: 'DigitalOcean', amount: 450, status: 'pending', date: '2024-01-01', dueDate: '2024-02-01', category: 'Cloud Services' },
    { id: 'BILL-004', vendor: 'Slack Technologies', amount: 1200, status: 'paid', date: '2024-01-08', dueDate: '2024-02-08', category: 'Software' },
    { id: 'BILL-005', vendor: 'Google Cloud', amount: 3200, status: 'pending', date: '2024-01-20', dueDate: '2024-02-20', category: 'Cloud Services' },
    { id: 'BILL-006', vendor: 'Comcast Business', amount: 199, status: 'paid', date: '2024-01-01', dueDate: '2024-02-01', category: 'Utilities' },
  ]);
  
  const [payments, setPayments] = useState([
    { id: 'PAY-001', type: 'invoice', reference: 'INV-2024-001', customer: 'Acme Corporation', amount: 14697, method: 'Bank Transfer', date: '2024-01-28', status: 'completed' },
    { id: 'PAY-002', type: 'refund', reference: 'INV-2024-002', customer: 'TechStart Inc', amount: -50, method: 'Credit Card', date: '2024-01-16', status: 'completed' },
    { id: 'PAY-003', type: 'expense', reference: 'EXP-001', vendor: 'Figma Inc', amount: 540, method: 'Credit Card', date: '2024-01-05', status: 'completed' },
    { id: 'PAY-004', type: 'expense', reference: 'EXP-004', vendor: 'Google Ads', amount: 2500, method: 'Bank Transfer', date: '2024-01-15', status: 'completed' },
  ]);
  
  const [accounts] = useState([
    { id: 1, name: 'Business Checking', type: 'bank', balance: 125430, currency: 'USD' },
    { id: 2, name: 'Savings Reserve', type: 'bank', balance: 250000, currency: 'USD' },
    { id: 3, name: 'Accounts Receivable', type: 'receivable', balance: 51483, currency: 'USD' },
    { id: 4, name: 'Accounts Payable', type: 'liability', balance: 8234, currency: 'USD' },
    { id: 5, name: 'Credit Card - Chase', type: 'liability', balance: 3420, currency: 'USD' },
    { id: 6, name: 'Petty Cash', type: 'bank', balance: 500, currency: 'USD' },
  ]);
  
  const [taxes, setTaxes] = useState([
    { id: 1, name: 'Sales Tax', rate: 8.875, type: 'sales', collected: 2741, paid: 0, net: 2741 },
    { id: 2, name: 'VAT', rate: 10, type: 'sales', collected: 0, paid: 0, net: 0 },
  ]);
  
  const [stats, setStats] = useState({
    totalRevenue: 58420,
    totalExpenses: 18500,
    netProfit: 39920,
    outstandingInvoices: 51483,
    paidThisMonth: 14697,
    pendingBills: 5234,
  });
  
  useEffect(() => {
    const newSection = getSection();
    setActiveSection(newSection);
    setLoading(false);
  }, [path]);
  
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDateRange, setReportDateRange] = useState({ start: '2024-01-01', end: '2024-01-31' });
  
  const reportData = {
    incomeStatement: {
      revenue: [
        { item: 'Product Sales', amount: 42000 },
        { item: 'Service Revenue', amount: 12420 },
        { item: 'Subscription Revenue', amount: 4000 },
      ],
      expenses: [
        { item: 'Salaries & Wages', amount: 8500 },
        { item: 'Software & Tools', amount: 2540 },
        { item: 'Marketing & Ads', amount: 3500 },
        { item: 'Office & Utilities', amount: 1200 },
        { item: 'Travel & Entertainment', amount: 850 },
        { item: 'Professional Services', amount: 1410 },
      ],
      summary: { revenue: 58420, expenses: 18500, profit: 39920, margin: 68.3 }
    },
    balanceSheet: {
      assets: {
        current: [
          { item: 'Cash & Bank Balance', amount: 376430 },
          { item: 'Accounts Receivable', amount: 51483 },
          { item: 'Prepaid Expenses', amount: 2500 },
          { item: 'Inventory', amount: 15000 },
        ],
        fixed: [
          { item: 'Equipment', amount: 12000 },
          { item: 'Furniture & Fixtures', amount: 4500 },
          { item: 'Computer Hardware', amount: 3500 },
        ]
      },
      liabilities: {
        current: [
          { item: 'Accounts Payable', amount: 8234 },
          { item: 'Credit Card Payable', amount: 3420 },
          { item: 'Accrued Expenses', amount: 3000 },
        ],
        longTerm: [
          { item: 'Business Loan', amount: 10000 },
        ]
      },
      equity: [
        { item: 'Owner\'s Capital', amount: 300000 },
        { item: 'Retained Earnings', amount: 66276 },
      ]
    },
    cashFlow: {
      operating: [
        { item: 'Cash from Customers', amount: 52000 },
        { item: 'Cash to Suppliers', amount: -15000 },
        { item: 'Cash to Employees', amount: -8500 },
        { item: 'Operating Expenses', amount: -5500 },
      ],
      investing: [
        { item: 'Equipment Purchase', amount: -2000 },
        { item: 'Software Investment', amount: -1500 },
      ],
      financing: [
        { item: 'Business Loan Received', amount: 10000 },
        { item: 'Loan Repayment', amount: -2500 },
      ]
    },
    agingReport: {
      invoices: [
        { id: 'INV-2024-002', customer: 'TechStart Inc', amount: 539, days: 15 },
        { id: 'INV-2024-003', customer: 'GlobalTech Solutions', amount: 9843, days: 25 },
        { id: 'INV-2024-005', customer: 'Acme Corporation', amount: 5444, days: 5 },
        { id: 'INV-2024-003', customer: 'GlobalTech Solutions', amount: 5000, days: 65 },
        { id: 'INV-2024-002', customer: 'TechStart Inc', amount: 3200, days: 95 },
      ]
    },
    expenseReport: {
      categories: [
        { category: 'Software & Tools', amount: 2540, transactions: 5, color: 'blue' },
        { category: 'Marketing & Advertising', amount: 3500, transactions: 3, color: 'purple' },
        { category: 'Salaries & Wages', amount: 8500, transactions: 1, color: 'green' },
        { category: 'Travel & Transportation', amount: 1850, transactions: 8, color: 'yellow' },
        { category: 'Office Supplies & Utilities', amount: 1600, transactions: 12, color: 'red' },
        { category: 'Professional Services', amount: 1410, transactions: 4, color: 'cyan' },
      ]
    },
    taxSummary: {
      salesTax: { collected: 2741, paid: 0, rate: 8.875 },
      vat: { collected: 0, paid: 0, rate: 10 },
      details: [
        { tax: 'Sales Tax - NY', collected: 2741, paid: 0, rate: 8.875 },
        { tax: 'VAT - Services', collected: 0, paid: 0, rate: 10 },
      ]
    }
  };

  const formatCurrency = (amount) => {
    return formatCurrencyTheme(amount || 0);
  };

  const generateProfessionalPDF = (reportTitle) => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    let reportContent = '';
    let summaryData = '';
    
    if (reportTitle === 'Income Statement') {
      const revenue = reportData.incomeStatement.revenue;
      const expenses = reportData.incomeStatement.expenses;
      const summary = reportData.incomeStatement.summary;
      reportContent = `
        <div class="summary-boxes">
          <div class="summary-box revenue"><span class="label">Total Revenue</span><span class="value">${formatCurrency(summary.revenue)}</span></div>
          <div class="summary-box expense"><span class="label">Total Expenses</span><span class="value">${formatCurrency(summary.expenses)}</span></div>
          <div class="summary-box profit"><span class="label">Net Profit</span><span class="value">${formatCurrency(summary.profit)}</span><span class="margin">Margin: ${summary.margin}%</span></div>
        </div>
        <h3>Revenue Details</h3>
        <table>
          <thead><tr><th>Description</th><th class="text-right">Amount</th></tr></thead>
          <tbody>
            ${revenue.map(r => `<tr><td>${r.item}</td><td class="text-right positive">${formatCurrency(r.amount)}</td></tr>`).join('')}
            <tr class="total"><td>Total Revenue</td><td class="text-right positive">${formatCurrency(summary.revenue)}</td></tr>
          </tbody>
        </table>
        <h3>Expense Details</h3>
        <table>
          <thead><tr><th>Description</th><th class="text-right">Amount</th></tr></thead>
          <tbody>
            ${expenses.map(e => `<tr><td>${e.item}</td><td class="text-right negative">${formatCurrency(e.amount)}</td></tr>`).join('')}
            <tr class="total"><td>Total Expenses</td><td class="text-right negative">${formatCurrency(summary.expenses)}</td></tr>
          </tbody>
        </table>
      `;
    } else if (reportTitle === 'Balance Sheet') {
      const assets = reportData.balanceSheet.assets;
      const liabilities = reportData.balanceSheet.liabilities;
      const equity = reportData.balanceSheet.equity;
      reportContent = `
        <div class="summary-boxes">
          <div class="summary-box assets"><span class="label">Total Assets</span><span class="value">${formatCurrency(458413)}</span></div>
          <div class="summary-box liabilities"><span class="label">Total Liabilities</span><span class="value">${formatCurrency(24654)}</span></div>
          <div class="summary-box equity"><span class="label">Total Equity</span><span class="value">${formatCurrency(433759)}</span></div>
        </div>
        <div class="two-column">
          <div class="column">
            <h3>Assets</h3>
            <table>
              <thead><tr><th>Description</th><th class="text-right">Amount</th></tr></thead>
              <tbody>
                <tr class="sub-header"><td colspan="2">Current Assets</td></tr>
                ${assets.current.map(a => `<tr><td>${a.item}</td><td class="text-right">${formatCurrency(a.amount)}</td></tr>`).join('')}
                <tr class="sub-total"><td>Total Current Assets</td><td class="text-right">${formatCurrency(445413)}</td></tr>
                <tr class="sub-header"><td colspan="2">Fixed Assets</td></tr>
                ${assets.fixed.map(a => `<tr><td>${a.item}</td><td class="text-right">${formatCurrency(a.amount)}</td></tr>`).join('')}
                <tr class="total"><td>Total Assets</td><td class="text-right">${formatCurrency(458413)}</td></tr>
              </tbody>
            </table>
          </div>
          <div class="column">
            <h3>Liabilities & Equity</h3>
            <table>
              <thead><tr><th>Description</th><th class="text-right">Amount</th></tr></thead>
              <tbody>
                <tr class="sub-header"><td colspan="2">Current Liabilities</td></tr>
                ${liabilities.current.map(l => `<tr><td>${l.item}</td><td class="text-right">${formatCurrency(l.amount)}</td></tr>`).join('')}
                <tr class="sub-header"><td colspan="2">Long-term Liabilities</td></tr>
                ${liabilities.longTerm.map(l => `<tr><td>${l.item}</td><td class="text-right">${formatCurrency(l.amount)}</td></tr>`).join('')}
                <tr class="sub-total"><td>Total Liabilities</td><td class="text-right">${formatCurrency(24654)}</td></tr>
                <tr class="sub-header"><td colspan="2">Equity</td></tr>
                ${equity.map(e => `<tr><td>${e.item}</td><td class="text-right">${formatCurrency(e.amount)}</td></tr>`).join('')}
                <tr class="total"><td>Total Equity</td><td class="text-right">${formatCurrency(433759)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (reportTitle === 'Cash Flow') {
      const cf = reportData.cashFlow;
      reportContent = `
        <div class="summary-boxes">
          <div class="summary-box revenue"><span class="label">Total Inflows</span><span class="value">${formatCurrency(62000)}</span></div>
          <div class="summary-box expense"><span class="label">Total Outflows</span><span class="value">${formatCurrency(21500)}</span></div>
          <div class="summary-box profit"><span class="label">Net Cash Flow</span><span class="value">${formatCurrency(40500)}</span></div>
        </div>
        <div class="three-column">
          <div class="column">
            <h3>Operating</h3>
            <table>
              <tbody>
                ${cf.operating.map(i => `<tr><td>${i.item}</td><td class="text-right ${i.amount >= 0 ? 'positive' : 'negative'}">${formatCurrency(i.amount)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
          <div class="column">
            <h3>Investing</h3>
            <table>
              <tbody>
                ${cf.investing.map(i => `<tr><td>${i.item}</td><td class="text-right negative">${formatCurrency(i.amount)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
          <div class="column">
            <h3>Financing</h3>
            <table>
              <tbody>
                ${cf.financing.map(i => `<tr><td>${i.item}</td><td class="text-right ${i.amount >= 0 ? 'positive' : 'negative'}">${formatCurrency(i.amount)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (reportTitle === 'Aging Report') {
      const aging = reportData.agingReport.invoices;
      reportContent = `
        <div class="summary-boxes">
          <div class="summary-box current"><span class="label">Current (0-30)</span><span class="value">${formatCurrency(15983)}</span></div>
          <div class="summary-box days30"><span class="label">31-60 Days</span><span class="value">${formatCurrency(9843)}</span></div>
          <div class="summary-box days60"><span class="label">61-90 Days</span><span class="value">${formatCurrency(5000)}</span></div>
          <div class="summary-box overdue"><span class="label">90+ Days</span><span class="value">${formatCurrency(3200)}</span></div>
        </div>
        <h3>Invoice Aging Details</h3>
        <table>
          <thead><tr><th>Invoice #</th><th>Customer</th><th class="text-center">Days</th><th class="text-right">Amount</th></tr></thead>
          <tbody>
            ${aging.map(a => `<tr><td>${a.id}</td><td>${a.customer}</td><td class="text-center">${a.days} days</td><td class="text-right">${formatCurrency(a.amount)}</td></tr>`).join('')}
            <tr class="total"><td colspan="3">Total Outstanding</td><td class="text-right">${formatCurrency(34026)}</td></tr>
          </tbody>
        </table>
      `;
    } else if (reportTitle === 'Expense Report') {
      const exp = reportData.expenseReport.categories;
      const total = 18500;
      reportContent = `
        <div class="expense-grid">
          ${exp.map(e => `<div class="expense-card"><span class="expense-category">${e.category}</span><span class="expense-amount">${formatCurrency(e.amount)}</span><span class="expense-txn">${e.transactions} transactions</span></div>`).join('')}
        </div>
        <h3>Expense Breakdown</h3>
        <table>
          <thead><tr><th>Category</th><th class="text-center">Transactions</th><th class="text-right">Amount</th><th class="text-right">% of Total</th></tr></thead>
          <tbody>
            ${exp.map(e => `<tr><td>${e.category}</td><td class="text-center">${e.transactions}</td><td class="text-right">${formatCurrency(e.amount)}</td><td class="text-right">${((e.amount / total) * 100).toFixed(1)}%</td></tr>`).join('')}
            <tr class="total"><td>Total Expenses</td><td class="text-center">33</td><td class="text-right">${formatCurrency(total)}</td><td class="text-right">100%</td></tr>
          </tbody>
        </table>
      `;
    } else if (reportTitle === 'Tax Summary') {
      const tax = reportData.taxSummary;
      reportContent = `
        <div class="summary-boxes">
          <div class="summary-box revenue"><span class="label">Total Collected</span><span class="value">${formatCurrency(2741)}</span></div>
          <div class="summary-box expense"><span class="label">Total Paid</span><span class="value">${formatCurrency(0)}</span></div>
          <div class="summary-box profit"><span class="label">Net Liability</span><span class="value">${formatCurrency(2741)}</span></div>
        </div>
        <h3>Tax Details</h3>
        <table>
          <thead><tr><th>Tax Type</th><th class="text-center">Rate</th><th class="text-right">Collected</th><th class="text-right">Paid</th><th class="text-right">Net</th></tr></thead>
          <tbody>
            ${tax.details.map(t => `<tr><td>${t.tax}</td><td class="text-center">${t.rate}%</td><td class="text-right positive">${formatCurrency(t.collected)}</td><td class="text-right negative">${formatCurrency(t.paid)}</td><td class="text-right">${formatCurrency(t.collected - t.paid)}</td></tr>`).join('')}
            <tr class="total"><td>Total</td><td></td><td class="text-right positive">${formatCurrency(2741)}</td><td class="text-right negative">${formatCurrency(0)}</td><td class="text-right">${formatCurrency(2741)}</td></tr>
          </tbody>
        </table>
      `;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle} - JenQ ERP</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; background: #fff; }
            
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #6366f1; }
            .company-info h1 { font-size: 28px; color: #6366f1; font-weight: 700; letter-spacing: -0.5px; }
            .company-info p { color: #64748b; font-size: 14px; margin-top: 4px; }
            .report-meta { text-align: right; }
            .report-meta h2 { font-size: 20px; color: #1e293b; font-weight: 600; }
            .report-meta .date { color: #64748b; font-size: 13px; margin-top: 4px; }
            .report-meta .period { background: #f1f5f9; padding: 4px 12px; border-radius: 20px; font-size: 12px; color: #6366f1; margin-top: 8px; display: inline-block; }
            
            .summary-boxes { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 40px; }
            .summary-box { background: #f8fafc; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #e2e8f0; }
            .summary-box .label { display: block; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
            .summary-box .value { display: block; font-size: 24px; font-weight: 700; color: #1e293b; }
            .summary-box .margin { display: block; font-size: 11px; color: #64748b; margin-top: 4px; }
            .summary-box.revenue { background: #ecfdf5; border-color: #a7f3d0; }
            .summary-box.revenue .value { color: #059669; }
            .summary-box.expense { background: #fef2f2; border-color: #fecaca; }
            .summary-box.expense .value { color: #dc2626; }
            .summary-box.profit { background: #eff6ff; border-color: #bfdbfe; }
            .summary-box.profit .value { color: #2563eb; }
            .summary-box.assets .value { color: #0891b2; }
            .summary-box.liabilities .value { color: #dc2626; }
            .summary-box.equity .value { color: #6366f1; }
            .summary-box.current { background: #ecfdf5; border-color: #a7f3d0; }
            .summary-box.current .value { color: #059669; }
            .summary-box.days30 { background: #fefce8; border-color: #fef08a; }
            .summary-box.days30 .value { color: #ca8a04; }
            .summary-box.days60 { background: #fff7ed; border-color: #fed7aa; }
            .summary-box.days60 .value { color: #ea580c; }
            .summary-box.overdue { background: #fef2f2; border-color: #fecaca; }
            .summary-box.overdue .value { color: #dc2626; }
            
            h3 { font-size: 16px; color: #1e293b; font-weight: 600; margin: 30px 0 16px 0; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
            
            table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
            th { background: #f8fafc; padding: 12px 16px; text-align: left; font-weight: 600; color: #475569; border-bottom: 2px solid #e2e8f0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
            td { padding: 10px 16px; border-bottom: 1px solid #f1f5f9; color: #334155; }
            tr:hover { background: #f8fafc; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .positive { color: #059669; font-weight: 500; }
            .negative { color: #dc2626; font-weight: 500; }
            tr.total { background: #f1f5f9; font-weight: 700; color: #1e293b; }
            tr.total td { border-top: 2px solid #cbd5e1; }
            tr.sub-header td { background: #f8fafc; font-weight: 600; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 16px; }
            tr.sub-total td { font-weight: 600; background: #f1f5f9; }
            
            .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 20px; }
            .two-column .column h3 { margin-top: 0; }
            .three-column { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 20px; }
            .three-column .column { background: #f8fafc; border-radius: 8px; padding: 16px; }
            .three-column h3 { margin-top: 0; font-size: 14px; border-bottom: none; padding-bottom: 0; }
            .three-column table { margin-top: 12px; }
            .three-column td { padding: 6px 0; font-size: 12px; }
            
            .expense-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 30px; }
            .expense-card { background: #f8fafc; border-radius: 10px; padding: 20px; text-align: center; border: 1px solid #e2e8f0; }
            .expense-category { display: block; font-size: 12px; color: #64748b; margin-bottom: 8px; }
            .expense-amount { display: block; font-size: 20px; font-weight: 700; color: #1e293b; }
            .expense-txn { display: block; font-size: 11px; color: #94a3b8; margin-top: 4px; }
            
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }
            .footer .generated { }
            .footer .page { }
            
            @media print {
              body { padding: 20mm; }
              .header { margin-bottom: 30px; }
              .summary-boxes { grid-template-columns: repeat(3, 1fr); }
              .two-column { grid-template-columns: 1fr 1fr; gap: 20px; }
              .three-column { grid-template-columns: 1fr 1fr 1fr; }
              .expense-grid { grid-template-columns: repeat(3, 1fr); }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              <h1>JenQ ERP</h1>
              <p>Enterprise Business Solutions</p>
            </div>
            <div class="report-meta">
              <h2>${reportTitle}</h2>
              <p class="date">Generated on ${today}</p>
              <span class="period">${reportDateRange.start} to ${reportDateRange.end}</span>
            </div>
          </div>
          
          ${reportContent}
          
          <div class="footer">
            <span class="generated">Generated by JenQ ERP</span>
            <span class="page">Page 1 of 1</span>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const printReport = () => {
    generateProfessionalPDF(selectedReport?.title);
  };
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState({
    customerId: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    taxRate: 8.875,
    discount: 0,
    notes: '',
    dueDate: '',
  });
  
  const addInvoiceItem = () => {
    setInvoiceForm({
      ...invoiceForm,
      items: [...invoiceForm.items, { description: '', quantity: 1, unitPrice: 0 }]
    });
  };
  
  const removeInvoiceItem = (index) => {
    setInvoiceForm({
      ...invoiceForm,
      items: invoiceForm.items.filter((_, i) => i !== index)
    });
  };
  
  const updateInvoiceItem = (index, field, value) => {
    const newItems = [...invoiceForm.items];
    newItems[index][field] = value;
    setInvoiceForm({ ...invoiceForm, items: newItems });
  };
  
  const calculateInvoiceTotals = () => {
    const subtotal = invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const discountAmount = invoiceForm.discount;
    const afterDiscount = subtotal - discountAmount;
    const tax = afterDiscount * (invoiceForm.taxRate / 100);
    const total = afterDiscount + tax;
    return { subtotal, discountAmount, tax, total };
  };
  
  const createInvoice = () => {
    const totals = calculateInvoiceTotals();
    const customer = customers.find(c => c.id === invoiceForm.customerId);
    const newInvoice = {
      id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      customerId: invoiceForm.customerId,
      customerName: customer?.name || 'Unknown',
      items: invoiceForm.items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discountAmount,
      total: totals.total,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: invoiceForm.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paidAt: null,
      notes: invoiceForm.notes,
    };
    setInvoices([newInvoice, ...invoices]);
    setShowInvoiceModal(false);
    setInvoiceForm({ customerId: '', items: [{ description: '', quantity: 1, unitPrice: 0 }], taxRate: 8.875, discount: 0, notes: '', dueDate: '' });
  };
  
  const sendInvoice = (invoiceId) => {
    setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, status: 'sent' } : inv));
  };
  
  const markAsPaid = (invoiceId) => {
    setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, status: 'paid', paidAt: new Date().toISOString().split('T')[0] } : inv));
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setPayments([{ id: `PAY-${Date.now()}`, type: 'invoice', reference: invoiceId, customer: invoice.customerName, amount: invoice.total, method: 'Bank Transfer', date: new Date().toISOString().split('T')[0], status: 'completed' }, ...payments]);
    }
  };
  
  const deleteInvoice = (invoiceId) => {
    setInvoices(invoices.filter(inv => inv.id !== invoiceId));
  };
  
  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-500/20 text-green-500 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      overdue: 'bg-red-500/20 text-red-500 border-red-500/30',
      draft: 'bg-slate-500/20 text-slate-500 border-slate-500/30',
      sent: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      completed: 'bg-green-500/20 text-green-500 border-green-500/30',
      approved: 'bg-green-500/20 text-green-500 border-green-500/30',
      active: 'bg-green-500/20 text-green-500 border-green-500/30',
      inactive: 'bg-slate-500/20 text-slate-500 border-slate-500/30',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-500 border-slate-500/30';
  };

  const getStatusIcon = (status) => {
    const icons = {
      paid: <CheckCircle size={14} />,
      pending: <Clock size={14} />,
      overdue: <AlertCircle size={14} />,
      draft: <FileText size={14} />,
      sent: <Mail size={14} />,
    };
    return icons[status] || <Clock size={14} />;
  };

  const getTitle = () => {
    const titles = {
      dashboard: 'Billing Dashboard',
      invoices: 'Invoices',
      bills: 'Bills & Vendors',
      payments: 'Payments',
      expenses: 'Expenses',
      accounts: 'Chart of Accounts',
      reports: 'Reports',
      tax: 'Tax Settings',
      customers: 'Customers',
    };
    return titles[section] || 'Accounting';
  };
  
  const totalOutstanding = invoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;
  const draftCount = invoices.filter(inv => inv.status === 'draft').length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{getTitle()}</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Complete billing and financial management</p>
          </div>
          <div className="flex gap-2">
            {section === 'invoices' && (
              <button onClick={() => setShowInvoiceModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20">
                <Plus size={16} /> New Invoice
              </button>
            )}
            {section === 'customers' && (
              <button onClick={() => setShowCustomerModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20">
                <Plus size={16} /> Add Customer
              </button>
            )}
            {section === 'expenses' && (
              <button onClick={() => setShowExpenseModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20">
                <Plus size={16} /> Add Expense
              </button>
            )}
          </div>
        </div>

        {section === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-6 rounded-2xl border shadow-lg ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                    <ArrowUpRight size={24} className="text-green-500" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/20 text-green-500">+12.5%</span>
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Revenue</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className={`p-6 rounded-2xl border shadow-lg ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                    <ArrowDownRight size={24} className="text-red-500" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-500/20 text-red-500">+8.2%</span>
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Expenses</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(stats.totalExpenses)}</p>
              </div>
              <div className={`p-6 rounded-2xl border shadow-lg ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                    <TrendingUp size={24} className="text-primary-500" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-500/20 text-primary-500">+15.3%</span>
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Net Profit</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(stats.netProfit)}</p>
              </div>
              <div className={`p-6 rounded-2xl border shadow-lg ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                    <CreditCard size={24} className="text-yellow-500" />
                  </div>
                  {overdueCount > 0 && <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-500/20 text-red-500">{overdueCount} overdue</span>}
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Outstanding</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(totalOutstanding)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-lg ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Invoices</h3>
                  <button className="text-sm text-primary-500 hover:text-primary-600">View All</button>
                </div>
                <div className="space-y-3">
                  {invoices.slice(0, 5).map(inv => (
                    <div key={inv.id} className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'} transition-colors cursor-pointer`} onClick={() => setSelectedInvoice(inv)}>
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-white'}`}>
                          <FileText size={20} className="text-primary-500" />
                        </div>
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{inv.id}</p>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{inv.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(inv.total)}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Due: {inv.dueDate}</p>
                        </div>
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(inv.status)}`}>
                          {getStatusIcon(inv.status)}
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-2xl border shadow-lg ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/20"><FileText size={18} className="text-blue-500" /></div>
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Draft</span>
                    </div>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{draftCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-yellow-500/20"><Clock size={18} className="text-yellow-500" /></div>
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Pending</span>
                    </div>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{invoices.filter(i => i.status === 'sent').length}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/20"><AlertCircle size={18} className="text-red-500" /></div>
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Overdue</span>
                    </div>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{overdueCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/20"><CheckCircle size={18} className="text-green-500" /></div>
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Paid This Month</span>
                    </div>
                    <span className={`font-bold text-green-500`}>{formatCurrency(stats.paidThisMonth)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {section === 'invoices' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input type="text" placeholder="Search invoices by ID or customer..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                </div>
                <select className={`px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`}>
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
            
            <div className={`rounded-2xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                    <tr>
                      <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Invoice</th>
                      <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Customer</th>
                      <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Items</th>
                      <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Amount</th>
                      <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Date</th>
                      <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Due</th>
                      <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Status</th>
                      <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {invoices.filter(inv => inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || inv.id.toLowerCase().includes(searchQuery.toLowerCase())).map((inv, idx) => (
                      <tr key={inv.id} className={`transition-colors ${idx % 2 === 0 ? (isDark ? 'bg-slate-900/50' : 'bg-white') : (isDark ? 'bg-slate-800/20' : 'bg-slate-50/50')}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                              <FileText size={16} className="text-primary-500" />
                            </div>
                            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{inv.id}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{inv.customerName}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{inv.items.length} items</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`font-bold text-lg ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>{formatCurrency(inv.total)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{inv.createdAt}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-sm ${inv.status === 'overdue' ? 'text-red-500' : isDark ? 'text-slate-400' : 'text-slate-600'}`}>{inv.dueDate}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 w-fit ${getStatusColor(inv.status)}`}>
                            {getStatusIcon(inv.status)}
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            {inv.status === 'draft' && (
                              <button onClick={() => sendInvoice(inv.id)} className="p-2 rounded-lg hover:bg-primary-500/10 text-primary-500" title="Send Invoice">
                                <Send size={16} />
                              </button>
                            )}
                            {(inv.status === 'sent' || inv.status === 'overdue') && (
                              <button onClick={() => markAsPaid(inv.id)} className="p-2 rounded-lg hover:bg-green-500/10 text-green-500" title="Mark as Paid">
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button onClick={() => setSelectedInvoice(inv)} className="p-2 rounded-lg hover:bg-slate-600/30 text-slate-400" title="View">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-slate-600/30 text-slate-400" title="Print">
                              <Printer size={16} />
                            </button>
                            {inv.status === 'draft' && (
                              <button onClick={() => deleteInvoice(inv.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {section === 'customers' && (
          <div className={`rounded-2xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Customer</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Contact</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Total Invoiced</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Outstanding</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Status</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {customers.map((cust, idx) => (
                    <tr key={cust.id} className={`transition-colors ${idx % 2 === 0 ? (isDark ? 'bg-slate-900/50' : 'bg-white') : (isDark ? 'bg-slate-800/20' : 'bg-slate-50/50')}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-600'}`}>
                            {cust.name.charAt(0)}
                          </div>
                          <div>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{cust.name}</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{cust.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{cust.email}</p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{cust.phone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(cust.totalInvoiced)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`font-semibold ${cust.outstanding > 0 ? 'text-yellow-500' : isDark ? 'text-slate-300' : 'text-slate-600'}`}>{formatCurrency(cust.outstanding)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusColor(cust.status)}`}>{cust.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-2 rounded-lg hover:bg-primary-500/10 text-primary-500" title="Create Invoice"><Plus size={16} /></button>
                          <button className="p-2 rounded-lg hover:bg-slate-600/30 text-slate-400" title="View"><Eye size={16} /></button>
                          <button className="p-2 rounded-lg hover:bg-slate-600/30 text-slate-400" title="Edit"><Edit2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === 'payments' && (
          <div className={`rounded-2xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Payment ID</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Type</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Reference</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Party</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Amount</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Method</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Date</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {payments.map((pay, idx) => (
                    <tr key={pay.id} className={`transition-colors ${idx % 2 === 0 ? (isDark ? 'bg-slate-900/50' : 'bg-white') : (isDark ? 'bg-slate-800/20' : 'bg-slate-50/50')}`}>
                      <td className="px-5 py-4">
                        <span className={`font-medium ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>{pay.id}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded text-xs capitalize ${pay.type === 'refund' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>{pay.type}</span>
                      </td>
                      <td className="px-5 py-4">{pay.reference}</td>
                      <td className="px-5 py-4">{pay.customer || pay.vendor}</td>
                      <td className="px-5 py-4">
                        <span className={`font-bold ${pay.amount < 0 ? 'text-red-500' : isDark ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(pay.amount)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {pay.method === 'Bank Transfer' && <Banknote size={14} className="text-slate-400" />}
                          {pay.method === 'Credit Card' && <CreditCard size={14} className="text-slate-400" />}
                          {pay.method}
                        </div>
                      </td>
                      <td className="px-5 py-4">{pay.date}</td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusColor(pay.status)}`}>{pay.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === 'expenses' && (
          <div className={`rounded-2xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>ID</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Category</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Description</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Vendor</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Amount</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Date</th>
                    <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {expenses.map((exp, idx) => (
                    <tr key={exp.id} className={`transition-colors ${idx % 2 === 0 ? (isDark ? 'bg-slate-900/50' : 'bg-white') : (isDark ? 'bg-slate-800/20' : 'bg-slate-50/50')}`}>
                      <td className="px-5 py-4 font-medium text-primary-500">{exp.id}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>{exp.category}</span>
                      </td>
                      <td className="px-5 py-4">{exp.title}</td>
                      <td className="px-5 py-4">{exp.vendor}</td>
                      <td className="px-5 py-4 font-semibold">{formatCurrency(exp.amount)}</td>
                      <td className="px-5 py-4">{exp.date}</td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusColor(exp.status)}`}>{exp.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
)}
          
          {section === 'bills' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input type="text" placeholder="Search bills..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                  </div>
                </div>
              </div>
              
              <div className={`rounded-2xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                      <tr>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Bill ID</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Vendor</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Category</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Amount</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Date</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Due Date</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Status</th>
                        <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {bills.filter(b => b.vendor.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase())).map((bill, idx) => (
                        <tr key={bill.id} className={`transition-colors ${idx % 2 === 0 ? (isDark ? 'bg-slate-900/50' : 'bg-white') : (isDark ? 'bg-slate-800/20' : 'bg-slate-50/50')}`}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                                <Receipt size={16} className="text-red-500" />
                              </div>
                              <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{bill.id}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{bill.vendor}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded text-xs ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>{bill.category}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(bill.amount)}</span>
                          </td>
                          <td className={`px-5 py-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{bill.date}</td>
                          <td className={`px-5 py-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{bill.dueDate}</td>
                          <td className="px-5 py-4">
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusColor(bill.status)}`}>
                              {bill.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <button className="p-2 rounded-lg hover:bg-primary-500/10 text-primary-500" title="View">
                                <Eye size={16} />
                              </button>
                              {bill.status === 'pending' && (
                                <button className="p-2 rounded-lg hover:bg-green-500/10 text-green-500" title="Mark as Paid">
                                  <CheckCircle size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        {section === 'accounts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((acc, idx) => (
              <div key={acc.id} className={`p-6 rounded-2xl border shadow-lg ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${acc.type === 'bank' ? (isDark ? 'bg-blue-500/10' : 'bg-blue-50') : acc.type === 'liability' ? (isDark ? 'bg-red-500/10' : 'bg-red-50') : (isDark ? 'bg-green-500/10' : 'bg-green-50')}`}>
                    {acc.type === 'bank' ? <Wallet size={24} className="text-blue-500" /> : acc.type === 'liability' ? <CreditCard size={24} className="text-red-500" /> : <Receipt size={24} className="text-green-500" />}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs capitalize ${acc.type === 'bank' ? 'bg-blue-500/20 text-blue-500' : acc.type === 'liability' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>{acc.type}</span>
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{acc.name}</p>
                <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(acc.balance)}</p>
              </div>
            ))}
          </div>
        )}

        {section === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Income Statement', icon: BarChart3, desc: 'Revenue and expenses for a period', color: 'primary', data: { revenue: 58420, expenses: 18500, profit: 39920 } },
              { title: 'Balance Sheet', icon: Calculator, desc: 'Assets, liabilities, and equity', color: 'blue', data: { assets: 380930, liabilities: 14654, equity: 366276 } },
              { title: 'Cash Flow', icon: Activity, desc: 'Cash inflows and outflows', color: 'green', data: { inflows: 62500, outflows: 22000, net: 40500 } },
              { title: 'Aging Report', icon: Calendar, desc: 'Accounts receivable aging', color: 'yellow', data: { current: 25000, days30: 15000, days60: 8000, days90: 3483 } },
              { title: 'Expense Report', icon: Receipt, desc: 'Detailed expense breakdown', color: 'red', data: { software: 1290, travel: 850, office: 400, marketing: 2500, utilities: 199 } },
              { title: 'Tax Summary', icon: DollarSign, desc: 'Tax collected and paid', color: 'purple', data: { salesTax: 2741, vat: 0, total: 2741 } },
            ].map((report, i) => (
              <div key={i} onClick={() => setSelectedReport(report)}
                className={`p-6 rounded-2xl border shadow-lg cursor-pointer transition-all hover:scale-[1.02] ${isDark ? 'bg-slate-900 border-slate-700 hover:border-primary-500' : 'bg-white border-slate-200 hover:border-primary-500'}`}>
                <div className={`p-3 rounded-xl w-fit mb-4 ${isDark ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                  <report.icon size={28} className="text-primary-500" />
                </div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.title}</h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{report.desc}</p>
              </div>
            ))}
          </div>
        )}

        {section === 'tax' && (
          <div className="space-y-4">
            <div className={`p-6 rounded-2xl border shadow-lg ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Tax Configuration</h3>
              <div className="space-y-4">
                {taxes.map(tax => (
                  <div key={tax.id} className={`p-5 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{tax.name}</p>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rate: {tax.rate}%</p>
                      </div>
                      <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">Edit</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Collected</p>
                        <p className={`font-bold text-lg ${isDark ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(tax.collected)}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Paid</p>
                        <p className={`font-bold text-lg ${isDark ? 'text-red-400' : 'text-red-600'}`}>{formatCurrency(tax.paid)}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Net</p>
                        <p className={`font-bold text-lg ${tax.net >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(tax.net)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-6 rounded-2xl border shadow-lg ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Add New Tax</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tax Name</label>
                  <input type="text" placeholder="e.g., VAT" className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Rate (%)</label>
                  <input type="number" placeholder="10" className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Type</label>
                  <select className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`}>
                    <option>Sales Tax</option>
                    <option>Purchase Tax</option>
                    <option>VAT</option>
                    <option>GST</option>
                  </select>
                </div>
              </div>
              <button className="mt-6 px-6 py-2.5 rounded-lg bg-primary-500 text-white hover:bg-primary-600 font-medium">Add Tax</button>
            </div>
          </div>
        )}
      </div>

      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-2xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white'} border shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Create New Invoice</h2>
                <button onClick={() => setShowInvoiceModal(false)} className="p-2 rounded-lg hover:bg-slate-600/30">
                  <X size={20} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Customer</label>
                <select value={invoiceForm.customerId} onChange={(e) => setInvoiceForm({...invoiceForm, customerId: e.target.value})}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`}>
                  <option value="">Select Customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Line Items</label>
                  <button onClick={addInvoiceItem} className="text-sm text-primary-500 hover:text-primary-600 font-medium">+ Add Item</button>
                </div>
                <div className="space-y-3">
                  {invoiceForm.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateInvoiceItem(idx, 'description', e.target.value)}
                        className={`flex-1 px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                      <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateInvoiceItem(idx, 'quantity', parseInt(e.target.value) || 0)}
                        className={`w-20 px-3 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                      <input type="number" placeholder="Price" value={item.unitPrice} onChange={(e) => updateInvoiceItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className={`w-28 px-3 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                      {invoiceForm.items.length > 1 && (
                        <button onClick={() => removeInvoiceItem(idx)} className="p-2.5 rounded-lg hover:bg-red-500/10 text-red-500">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tax Rate (%)</label>
                  <input type="number" step="0.01" value={invoiceForm.taxRate} onChange={(e) => setInvoiceForm({...invoiceForm, taxRate: parseFloat(e.target.value) || 0})}
                    className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Discount ($)</label>
                  <input type="number" value={invoiceForm.discount} onChange={(e) => setInvoiceForm({...invoiceForm, discount: parseFloat(e.target.value) || 0})}
                    className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Due Date</label>
                <input type="date" value={invoiceForm.dueDate} onChange={(e) => setInvoiceForm({...invoiceForm, dueDate: e.target.value})}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Notes</label>
                <textarea value={invoiceForm.notes} onChange={(e) => setInvoiceForm({...invoiceForm, notes: e.target.value})} rows={3}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} placeholder="Optional notes..." />
              </div>
              
              <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Subtotal</span>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{formatCurrency(calculateInvoiceTotals().subtotal)}</span>
                  </div>
                  {invoiceForm.discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount</span>
                      <span>-{formatCurrency(calculateInvoiceTotals().discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Tax ({invoiceForm.taxRate}%)</span>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{formatCurrency(calculateInvoiceTotals().tax)}</span>
                  </div>
                  <div className={`flex justify-between text-lg font-bold pt-2 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>Total</span>
                    <span className="text-primary-500">{formatCurrency(calculateInvoiceTotals().total)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`p-6 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex gap-3">
                <button onClick={() => setShowInvoiceModal(false)} className={`flex-1 py-3 rounded-lg border ${isDark ? 'border-slate-600 text-slate-300' : 'border-slate-300'}`}>Cancel</button>
                <button onClick={createInvoice} className="flex-1 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 font-medium">Create Invoice</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-3xl rounded-2xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white'} border shadow-2xl`}>
            <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedInvoice.id}</h2>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selectedInvoice.customerName}</p>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="p-2 rounded-lg hover:bg-slate-600/30">
                  <X size={20} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(selectedInvoice.status)}`}>{selectedInvoice.status}</span>
                <div className="text-right">
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Created: {selectedInvoice.createdAt}</p>
                  <p className={`text-sm ${selectedInvoice.status === 'overdue' ? 'text-red-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>Due: {selectedInvoice.dueDate}</p>
                </div>
              </div>
              
              <div className={`rounded-xl overflow-hidden mb-6 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <table className="w-full">
                  <thead className={isDark ? 'bg-slate-700/50' : 'bg-slate-100'}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Description</th>
                      <th className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Qty</th>
                      <th className={`px-4 py-3 text-right text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Unit Price</th>
                      <th className={`px-4 py-3 text-right text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3">{item.description}</td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end">
                <div className={`w-64 space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount</span>
                      <span>-{formatCurrency(selectedInvoice.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{formatCurrency(selectedInvoice.tax)}</span>
                  </div>
                  <div className={`flex justify-between text-lg font-bold pt-2 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>Total</span>
                    <span className="text-primary-500">{formatCurrency(selectedInvoice.total)}</span>
                  </div>
                </div>
              </div>
              
              {selectedInvoice.notes && (
                <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Notes</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
            <div className={`p-6 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex gap-3">
                <button className={`flex-1 py-3 rounded-lg border ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
                  <Printer size={16} className="inline mr-2" /> Print
                </button>
                <button className={`flex-1 py-3 rounded-lg border ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
                  <Download size={16} className="inline mr-2" /> PDF
                </button>
                {selectedInvoice.status === 'draft' && (
                  <button onClick={() => { sendInvoice(selectedInvoice.id); setSelectedInvoice(null); }} className="flex-1 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
                    <Send size={16} className="inline mr-2" /> Send
                  </button>
                )}
                {(selectedInvoice.status === 'sent' || selectedInvoice.status === 'overdue') && (
                  <button onClick={() => { markAsPaid(selectedInvoice.id); setSelectedInvoice(null); }} className="flex-1 py-3 rounded-lg bg-green-500 text-white hover:bg-green-600">
                    <CheckCircle size={16} className="inline mr-2" /> Mark Paid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`w-full max-w-4xl rounded-2xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white'} border shadow-2xl my-8`}>
            <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedReport.title}</h2>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Period: {reportDateRange.start} to {reportDateRange.end}</p>
                </div>
                <button onClick={() => setSelectedReport(null)} className="p-2 rounded-lg hover:bg-slate-600/30">
                  <X size={24} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6" id={`report-${selectedReport?.title?.replace(/\s/g, '-').toLowerCase()}`}>
              {selectedReport.title === 'Income Statement' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>Total Revenue</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(reportData.incomeStatement.summary.revenue)}</p>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>Total Expenses</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{formatCurrency(reportData.incomeStatement.summary.expenses)}</p>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>Net Profit</p>
                      <p className={`text-2xl font-bold text-primary-500`}>{formatCurrency(reportData.incomeStatement.summary.profit)}</p>
                      <p className={`text-xs ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>Margin: {reportData.incomeStatement.summary.margin}%</p>
                    </div>
                  </div>
                  
                  <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className={`px-4 py-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Revenue Breakdown</h3>
                    </div>
                    <table className="w-full">
                      <thead className={isDark ? 'bg-slate-700/50' : 'bg-slate-100'}>
                        <tr>
                          <th className={`px-4 py-2 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Item</th>
                          <th className={`px-4 py-2 text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {reportData.incomeStatement.revenue.map((item, i) => (
                          <tr key={i}>
                            <td className={`px-4 py-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.item}</td>
                            <td className={`px-4 py-2 text-right font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                        <tr className={isDark ? 'bg-slate-700/30' : 'bg-slate-100'}>
                          <td className={`px-4 py-2 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Total Revenue</td>
                          <td className={`px-4 py-2 text-right font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(reportData.incomeStatement.summary.revenue)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className={`px-4 py-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Expense Breakdown</h3>
                    </div>
                    <table className="w-full">
                      <thead className={isDark ? 'bg-slate-700/50' : 'bg-slate-100'}>
                        <tr>
                          <th className={`px-4 py-2 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Item</th>
                          <th className={`px-4 py-2 text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {reportData.incomeStatement.expenses.map((item, i) => (
                          <tr key={i}>
                            <td className={`px-4 py-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.item}</td>
                            <td className={`px-4 py-2 text-right font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                        <tr className={isDark ? 'bg-slate-700/30' : 'bg-slate-100'}>
                          <td className={`px-4 py-2 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Total Expenses</td>
                          <td className={`px-4 py-2 text-right font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{formatCurrency(reportData.incomeStatement.summary.expenses)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {selectedReport.title === 'Balance Sheet' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Total Assets</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{formatCurrency(458413)}</p>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>Total Liabilities</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{formatCurrency(24654)}</p>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>Total Equity</p>
                      <p className={`text-2xl font-bold text-primary-500`}>{formatCurrency(433759)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div className={`px-4 py-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Assets</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <p className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Current Assets</p>
                          {reportData.balanceSheet.assets.current.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.item}</span>
                              <span className={isDark ? 'text-white' : 'text-slate-900'}>{formatCurrency(item.amount)}</span>
                            </div>
                          ))}
                          <div className={`flex justify-between text-sm font-bold pt-2 border-t ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                            <span>Total Current</span>
                            <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>{formatCurrency(445413)}</span>
                          </div>
                        </div>
                        <div>
                          <p className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Fixed Assets</p>
                          {reportData.balanceSheet.assets.fixed.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.item}</span>
                              <span className={isDark ? 'text-white' : 'text-slate-900'}>{formatCurrency(item.amount)}</span>
                            </div>
                          ))}
                          <div className={`flex justify-between text-sm font-bold pt-2 border-t ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                            <span>Total Fixed</span>
                            <span>{formatCurrency(20000)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div className={`px-4 py-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Liabilities & Equity</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <p className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Current Liabilities</p>
                          {reportData.balanceSheet.liabilities.current.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.item}</span>
                              <span className={isDark ? 'text-white' : 'text-slate-900'}>{formatCurrency(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Long-term Liabilities</p>
                          {reportData.balanceSheet.liabilities.longTerm.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.item}</span>
                              <span className={isDark ? 'text-white' : 'text-slate-900'}>{formatCurrency(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Equity</p>
                          {reportData.balanceSheet.equity.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.item}</span>
                              <span className={isDark ? 'text-white' : 'text-slate-900'}>{formatCurrency(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedReport.title === 'Cash Flow' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>Total Inflows</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(62000)}</p>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>Total Outflows</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{formatCurrency(21500)}</p>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>Net Cash Flow</p>
                      <p className={`text-2xl font-bold text-primary-500`}>{formatCurrency(40500)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div className={`px-4 py-3 ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-700'}`}>Operating Activities</h3>
                      </div>
                      <div className="p-4 space-y-2">
                        {reportData.cashFlow.operating.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.item}</span>
                            <span className={item.amount >= 0 ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')}>{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div className={`px-4 py-3 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Investing Activities</h3>
                      </div>
                      <div className="p-4 space-y-2">
                        {reportData.cashFlow.investing.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.item}</span>
                            <span className={isDark ? 'text-red-400' : 'text-red-600'}>{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div className={`px-4 py-3 ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>Financing Activities</h3>
                      </div>
                      <div className="p-4 space-y-2">
                        {reportData.cashFlow.financing.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.item}</span>
                            <span className={item.amount >= 0 ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')}>{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedReport.title === 'Aging Report' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>Current (0-30)</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(15983)}</p>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>31-60 Days</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{formatCurrency(9843)}</p>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>61-90 Days</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{formatCurrency(5000)}</p>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>90+ Days</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{formatCurrency(3200)}</p>
                    </div>
                  </div>
                  
                  <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className={`px-4 py-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Invoice Details</h3>
                    </div>
                    <table className="w-full">
                      <thead className={isDark ? 'bg-slate-700/50' : 'bg-slate-100'}>
                        <tr>
                          <th className={`px-4 py-2 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Invoice</th>
                          <th className={`px-4 py-2 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Customer</th>
                          <th className={`px-4 py-2 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Days</th>
                          <th className={`px-4 py-2 text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {reportData.agingReport.invoices.map((inv, i) => (
                          <tr key={i}>
                            <td className={`px-4 py-2 font-medium ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>{inv.id}</td>
                            <td className={`px-4 py-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{inv.customer}</td>
                            <td className={`px-4 py-2 text-center`}>
                              <span className={`px-2 py-1 rounded text-xs ${
                                inv.days <= 30 ? 'bg-green-500/20 text-green-500' :
                                inv.days <= 60 ? 'bg-yellow-500/20 text-yellow-500' :
                                inv.days <= 90 ? 'bg-orange-500/20 text-orange-500' :
                                'bg-red-500/20 text-red-500'
                              }`}>{inv.days} days</span>
                            </td>
                            <td className={`px-4 py-2 text-right font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(inv.amount)}</td>
                          </tr>
                        ))}
                        <tr className={isDark ? 'bg-slate-700/30' : 'bg-slate-100'}>
                          <td colSpan={3} className={`px-4 py-2 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Total Outstanding</td>
                          <td className={`px-4 py-2 text-right font-bold text-primary-500`}>{formatCurrency(34026)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {selectedReport.title === 'Expense Report' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {reportData.expenseReport.categories.map((cat, i) => (
                      <div key={i} className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat.category}</span>
                          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{cat.transactions} txn</span>
                        </div>
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(cat.amount)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className={`px-4 py-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Expense Breakdown</h3>
                    </div>
                    <table className="w-full">
                      <thead className={isDark ? 'bg-slate-700/50' : 'bg-slate-100'}>
                        <tr>
                          <th className={`px-4 py-2 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Category</th>
                          <th className={`px-4 py-2 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Transactions</th>
                          <th className={`px-4 py-2 text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Amount</th>
                          <th className={`px-4 py-2 text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>% of Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {reportData.expenseReport.categories.map((cat, i) => (
                          <tr key={i}>
                            <td className={`px-4 py-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{cat.category}</td>
                            <td className={`px-4 py-2 text-center ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{cat.transactions}</td>
                            <td className={`px-4 py-2 text-right font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(cat.amount)}</td>
                            <td className={`px-4 py-2 text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{((cat.amount / 18500) * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                        <tr className={isDark ? 'bg-slate-700/30' : 'bg-slate-100'}>
                          <td className={`px-4 py-2 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Total</td>
                          <td className={`px-4 py-2 text-center font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>33</td>
                          <td className={`px-4 py-2 text-right font-bold text-primary-500`}>{formatCurrency(18500)}</td>
                          <td className={`px-4 py-2 text-right font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {selectedReport.title === 'Tax Summary' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>Total Collected</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(2741)}</p>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>Total Paid</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{formatCurrency(0)}</p>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>Net Liability</p>
                      <p className={`text-2xl font-bold text-primary-500`}>{formatCurrency(2741)}</p>
                    </div>
                  </div>
                  
                  <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className={`px-4 py-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Tax Details</h3>
                    </div>
                    <table className="w-full">
                      <thead className={isDark ? 'bg-slate-700/50' : 'bg-slate-100'}>
                        <tr>
                          <th className={`px-4 py-2 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tax Type</th>
                          <th className={`px-4 py-2 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rate</th>
                          <th className={`px-4 py-2 text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Collected</th>
                          <th className={`px-4 py-2 text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Paid</th>
                          <th className={`px-4 py-2 text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Net</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {reportData.taxSummary.details.map((tax, i) => (
                          <tr key={i}>
                            <td className={`px-4 py-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{tax.tax}</td>
                            <td className={`px-4 py-2 text-center ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{tax.rate}%</td>
                            <td className={`px-4 py-2 text-right ${isDark ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(tax.collected)}</td>
                            <td className={`px-4 py-2 text-right ${isDark ? 'text-red-400' : 'text-red-600'}`}>{formatCurrency(tax.paid)}</td>
                            <td className={`px-4 py-2 text-right font-medium ${tax.net >= 0 ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>{formatCurrency(tax.collected - tax.paid)}</td>
                          </tr>
                        ))}
                        <tr className={isDark ? 'bg-slate-700/30' : 'bg-slate-100'}>
                          <td className={`px-4 py-2 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Total</td>
                          <td className="px-4 py-2"></td>
                          <td className={`px-4 py-2 text-right font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(2741)}</td>
                          <td className={`px-4 py-2 text-right font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{formatCurrency(0)}</td>
                          <td className={`px-4 py-2 text-right font-bold text-primary-500`}>{formatCurrency(2741)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className={`p-6 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex gap-3">
                <button onClick={() => generateProfessionalPDF(selectedReport.title)} className={`flex-1 py-3 rounded-lg border ${isDark ? 'border-slate-600 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-50'} flex items-center justify-center gap-2`}>
                  <Download size={18} /> Export PDF
                </button>
                <button onClick={printReport} className={`flex-1 py-3 rounded-lg border ${isDark ? 'border-slate-600 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-50'} flex items-center justify-center gap-2`}>
                  <Printer size={18} /> Print Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AccountingPage;