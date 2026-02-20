// QuickBooks Clone - All captured data from the real account

export const companyName = "RusingAcademy";
export const userName = "Steven";

export const dashboardData = {
  profitAndLoss: {
    period: "Last month",
    netProfit: 522,
    percentage: 100,
    trend: "up",
    trendValue: "1200%",
    trendLabel: "from prior month",
    income: 540,
    expenses: 18,
  },
  expensesSummary: {
    period: "Last 30 days",
    spending: 18,
    percentage: 100,
    trend: "down",
    trendValue: "62%",
    trendLabel: "from prior 30 days",
    breakdown: [
      { name: "QuickBooks Payments Fees", amount: 18, percentage: 62, trend: "down" },
    ],
  },
  bankAccounts: {
    name: "RusingAcademy",
    bankBalance: 1550.0,
    qbBalance: 5630.69,
    lastUpdated: "232 days ago",
    toReview: 2,
  },
  cashFlow: {
    lastUpdated: "1 hours ago",
    todayBalance: 1550,
    months: ["May'25","Jun'25","Jul'25","Aug'25","Sep'25","Oct'25","Nov'25","Dec'25","Jan'26","Feb'26","Mar'26","Apr'26"],
    cashBalance: [1500,500,1550,1550,1550,1550,1550,1550,1550,1550,1550,1550],
    projectedBalance: [null,null,null,null,null,null,null,null,null,1550,1550,1550],
  },
};

export const invoices = [
  { date: "21/2/25", no: "0008-12-124", customer: "Sukhdeep Singh", amount: 452.00, status: "Overdue", statusDetail: "Overdue on 11/7/25", sent: true },
  { date: "21/2/25", no: "0008-12-125", customer: "Yasminder Dhillon", amount: 452.00, status: "Deposited" },
  { date: "26/2/25", no: "0008-12-126", customer: "Joshua Bernstein-Mason", amount: 542.40, status: "Deposited" },
  { date: "20/5/25", no: "0008-12-127", customer: "Mickael Wronski", amount: 2712.00, status: "Deposited" },
  { date: "30/5/25", no: "0008-12-128", customer: "Michel Sturgeon", amount: 1017.00, status: "Deposited" },
  { date: "9/6/25", no: "0008-12-130", customer: "Hassan Sheikh", amount: 1017.00, status: "Deposited" },
  { date: "12/6/25", no: "0008-12-131", customer: "Rebeca Marchon Capanema", amount: 1017.00, status: "Deposited" },
  { date: "8/7/25", no: "0008-12-129", customer: "Joshua Bernstein-Mason", amount: 949.20, status: "Deposited" },
  { date: "10/7/25", no: "0008-12-132", customer: "Jessica Chi-Yan Tam", amount: 1017.00, status: "Deposited" },
  { date: "5/11/25", no: "0008-12-133", customer: "Mickael Wronski", amount: 1627.20, status: "Deposited" },
  { date: "5/1/26", no: "0008-12-134", customer: "Somerset West Community Health Centre (SWCHC) – Accounts Payable", amount: 610.20, status: "Deposited" },
];

export const invoiceSummary = {
  unpaid: { total: 452.00, overdue: 452.00, notDueYet: 0 },
  paid: { total: 610.20, notDeposited: 0, deposited: 610.20 },
};

export const customers = [
  { name: "Aaron Snow", company: "", phone: "", balance: 0 },
  { name: "Anna Ballard", company: "Directorate Access to Information and Privacy / National Defence", phone: "613-901-6745", balance: 0 },
  { name: "CANADIAN DIGITAL SERVICE", company: "", phone: "", balance: 0 },
  { name: "Cheryl MCCONNEY-WILSON", company: "CANADIAN DIGITAL SERVICE", phone: "", balance: 0 },
  { name: "Mithula Naik", company: "Canadian Digital Service", phone: "613-290-3889", balance: 0 },
  { name: "Priyanka rahman", company: "CANADIAN DIGITAL SERVICE", phone: "", balance: 0 },
  { name: "Canadian Human Rights Commission", company: "", phone: "", balance: 0 },
  { name: "Christine Hagyard", company: "", phone: "", balance: 0 },
  { name: "COMMISSION CANADIENNE DES DROITS DE LA PERSONNE", company: "", phone: "", balance: 0 },
  { name: "Ebony Sager", company: "", phone: "", balance: 0 },
  { name: "Edith Bramwell", company: "Federal Public Sector Labour Relations and Employment Board", phone: "343-573-1764", balance: 0 },
  { name: "Employment and Social Development Canada (ESDC)", company: "", phone: "", balance: 0 },
  { name: "Ashley Evans", company: "Employment and Social Development Canada (ESDC)", phone: "819-247-2847", balance: 0 },
  { name: "Employment and Social Development Canada", company: "Employment and Social Development Canada", phone: "613-614-7620", balance: 0 },
  { name: "Honey Dacanay", company: "Employment and Social Development Canada (ESDC)", phone: "", balance: 0 },
  { name: "Spencer Daniels", company: "Employment and Social Development Canada", phone: "", balance: 0 },
  { name: "Stephanie Figas", company: "Employment and Social Development Canada", phone: "", balance: 0 },
  { name: "Flora Mak", company: "", phone: "", balance: 0 },
  { name: "Gabriella Calzadilla", company: "", phone: "", balance: 0 },
  { name: "Hassan Sheikh", company: "Immigration and Refugee Board of Canada / Government of Canada", phone: "416-985-6909", balance: 0 },
  { name: "Jason Toner", company: "", phone: "", balance: 0 },
  { name: "Jessica Chi-Yan Tam", company: "Immigration and Refugee Board of Canada", phone: "", balance: 0 },
  { name: "John Millons", company: "", phone: "", balance: 0 },
  { name: "Joshua Bernstein-Mason", company: "", phone: "", balance: 0 },
  { name: "Julie Bedard", company: "", phone: "", balance: 0 },
  { name: "Keri Wallden", company: "", phone: "", balance: 0 },
  { name: "Margaret Gilbert", company: "", phone: "613-292-2920", balance: 0 },
  { name: "Margit Bertalan", company: "Wildlife Conservation Society", phone: "", balance: 0 },
  { name: "Michel Sturgeon", company: "Commission de l'immigration et du statut de réfugié du Canada", phone: "", balance: 0 },
  { name: "Mickael Wronski", company: "", phone: "", balance: 0 },
  { name: "Offices of the Chair of the FPSLREB", company: "FPSLREB", phone: "613-854-5318", balance: 0 },
  { name: "Peter GIBAUT", company: "", phone: "", balance: 0 },
  { name: "Programme d'Éthique de la Défense SMA (SE)", company: "", phone: "", balance: 0 },
  { name: "Rebeca Marchon Capanema", company: "", phone: "226-503-7001", balance: 0 },
  { name: "Shari Affleck", company: "Canadian Coast Guard Auxiliary (National) Inc.", phone: "6136147620", balance: 0 },
  { name: "Somerset West Community Health Centre (SWCHC)", company: "Somerset West Community Health Centre (SWCHC)", phone: "613-600-6533", balance: 0 },
  { name: "Steve", company: "RusingAcademy", phone: "613-614-7620", balance: 0 },
  { name: "Sukhdeep Singh", company: "", phone: "437-299-2880", balance: 452.00 },
  { name: "Xiaopu Fung", company: "", phone: "", balance: 0 },
  { name: "Yasminder Dhillon", company: "", phone: "613-859-4215", balance: 0 },
];

export const customerSummary = {
  estimates: 0,
  overdueInvoices: 1,
  overdueAmount: 452.00,
  openInvoices: 1,
  openAmount: 452.00,
  recentlyPaid: 1,
  recentlyPaidAmount: 610.20,
};

export const products = [
  { name: "French Training", description: "ONLINE LESSONS VIA GOOGLE-MEET & GOOGLE CLASSROOM", category: "French courses", type: "Service", price: 60 },
  { name: "Hours", description: "", category: "", type: "Service", price: 0 },
  { name: "Livre-essai", description: "Ok", category: "", type: "Service", price: 10 },
  { name: "MC Honorarium – Men of Men Forum", description: "", category: "", type: "Service", price: 300 },
  { name: "Multimedia & Sound System – Men of Men", description: "", category: "", type: "Service", price: 240 },
  { name: "Multimedia & Sound System – Men of Men Forum", description: "", category: "", type: "Service", price: 240 },
  { name: "Préparation orale B", description: "ONLINE LESSONS VIA GOOGLE-MEET & GOOGLE CLASSROOM.", category: "French courses", type: "Service", price: 30 },
  { name: "Sales", description: "", category: "", type: "Service", price: 0 },
  { name: "Stripe Fee - Acodei", description: "", category: "", type: "Non-Inventory", price: 0 },
  { name: "Stripe Refund - Acodei", description: "", category: "", type: "Non-Inventory", price: 0 },
  { name: "Stripe Sales - Acodei", description: "", category: "", type: "Non-Inventory", price: 0 },
];

export const expenses = [
  { date: "15/01/2026", type: "Expense", payee: "QuickBooks Payments", beforeTax: 17.95, tax: 0, total: 17.95 },
  { date: "21/12/2025", type: "Expense", payee: "QuickBooks Payments", beforeTax: 47.44, tax: 0, total: 47.44 },
  { date: "10/07/2025", type: "Expense", payee: "QuickBooks Payments", beforeTax: 57.52, tax: 0, total: 57.52 },
  { date: "26/06/2025", type: "Cheque Expense", payee: "", beforeTax: 135.55, tax: 0, total: 135.55 },
  { date: "26/06/2025", type: "Cheque Expense", payee: "", beforeTax: 7195.57, tax: 0, total: 7195.57 },
  { date: "26/06/2025", type: "Cheque Expense", payee: "", beforeTax: 1171.82, tax: 0, total: 1171.82 },
  { date: "26/06/2025", type: "Cheque Expense", payee: "", beforeTax: 1171.82, tax: 0, total: 1171.82 },
  { date: "26/06/2025", type: "Cheque Expense", payee: "", beforeTax: 1171.82, tax: 0, total: 1171.82 },
  { date: "26/06/2025", type: "Cheque Expense", payee: "", beforeTax: 5268.00, tax: 0, total: 5268.00 },
  { date: "26/06/2025", type: "Cheque Expense", payee: "", beforeTax: 193345.51, tax: 0, total: 193345.51 },
  { date: "23/06/2025", type: "Expense", payee: "QuickBooks Payments", beforeTax: 78.90, tax: 0, total: 78.90 },
  { date: "20/06/2025", type: "Expense", payee: "QuickBooks Payments", beforeTax: 14.75, tax: 0, total: 14.75 },
  { date: "12/06/2025", type: "Expense", payee: "QuickBooks Payments", beforeTax: 44.98, tax: 0, total: 44.98 },
  { date: "02/06/2025", type: "Expense", payee: "QuickBooks Payments", beforeTax: 29.74, tax: 0, total: 29.74 },
  { date: "26/02/2025", type: "Expense", payee: "QuickBooks Payments", beforeTax: 15.98, tax: 0, total: 15.98 },
  { date: "24/02/2025", type: "Expense", payee: "QuickBooks Payments", beforeTax: 13.36, tax: 0, total: 13.36 },
];

export const chartOfAccounts = [
  { name: "RusingAcademy", type: "Bank", detailType: "Cash on hand", qbBalance: 5630.69, bankBalance: 1550.00 },
  { name: "Accounts Receivable (A/R)", type: "Accounts receivable (A/R)", detailType: "Accounts Receivable (A/R)", qbBalance: 452.00 },
  { name: "Inventory Asset", type: "Current assets", detailType: "Inventory", qbBalance: 0 },
  { name: "Prepaid expenses", type: "Current assets", detailType: "Prepaid Expenses", qbBalance: 0 },
  { name: "Stripe Clearing Refunds - Acodei", type: "Current assets", detailType: "Other current assets", qbBalance: 0 },
  { name: "Uncategorized Asset", type: "Current assets", detailType: "Other current assets", qbBalance: 0 },
  { name: "Undeposited Funds", type: "Current assets", detailType: "Undeposited Funds", qbBalance: 15763.50 },
  { name: "Accounts Payable (A/P)", type: "Accounts payable (A/P)", detailType: "Accounts Payable (A/P)", qbBalance: 0 },
  { name: "GST/HST Payable", type: "Other Current Liabilities", detailType: "GST/HST Payable", qbBalance: 23658.70 },
  { name: "GST/HST Suspense", type: "Other Current Liabilities", detailType: "GST/HST Suspense", qbBalance: 0 },
  { name: "Opening Balance Equity", type: "Equity", detailType: "Opening Balance Equity", qbBalance: -190875.62 },
  { name: "Retained Earnings", type: "Equity", detailType: "Retained Earnings" },
  { name: "Billable Expense Income", type: "Income", detailType: "Sales of Product Income" },
  { name: "Billable Expense Income (52)", type: "Income", detailType: "Sales of Product Income" },
  { name: "Billable Expense Income-1", type: "Income", detailType: "Sales of Product Income" },
  { name: "Discounts", type: "Income", detailType: "Discounts/Refunds Given" },
  { name: "Discounts given", type: "Income", detailType: "Discounts/Refunds Given" },
  { name: "Refunds-Allowances", type: "Income", detailType: "Discounts/Refunds Given" },
  { name: "Sales", type: "Income", detailType: "Sales of Product Income" },
  { name: "Sales of Product Income", type: "Income", detailType: "Sales of Product Income" },
  { name: "Shipping and Delivery Income", type: "Income", detailType: "Other Primary Income" },
  { name: "Unapplied Cash Payment Income", type: "Income", detailType: "Unapplied Cash Payment Income" },
  { name: "Uncategorized Income", type: "Income", detailType: "Sales of Product Income" },
  { name: "Cost of Goods Sold", type: "Cost of Goods Sold", detailType: "Supplies and materials - COS" },
  { name: "Cost of Labour - COS", type: "Cost of Goods Sold", detailType: "Cost of Labour - COS" },
  { name: "Freight and delivery - COS", type: "Cost of Goods Sold", detailType: "Shipping, Freight and Delivery - COS" },
  { name: "Other Costs - COS", type: "Cost of Goods Sold", detailType: "Other costs of service - COS" },
  { name: "Purchases - COS", type: "Cost of Goods Sold", detailType: "Other costs of service - COS" },
  { name: "Subcontractors - COS", type: "Cost of Goods Sold", detailType: "Cost of Labour - COS" },
  { name: "Supplies and materials - COS", type: "Cost of Goods Sold", detailType: "Supplies and materials - COS" },
  { name: "Advertising", type: "Expenses", detailType: "Advertising/Promotional" },
  { name: "Bad debts", type: "Expenses", detailType: "Bad debts" },
  { name: "Bank charges", type: "Expenses", detailType: "Bank charges" },
  { name: "Commissions and fees", type: "Expenses", detailType: "Other Miscellaneous Service Cost" },
  { name: "Disposal Fees", type: "Expenses", detailType: "Other Miscellaneous Service Cost" },
  { name: "Dues and Subscriptions", type: "Expenses", detailType: "Office/General Administrative Expenses" },
  { name: "Freight and Delivery", type: "Expenses", detailType: "Shipping, Freight, and Delivery" },
  { name: "Insurance", type: "Expenses", detailType: "Insurance" },
  { name: "Insurance - Disability", type: "Expenses", detailType: "Insurance" },
  { name: "Insurance - Liability", type: "Expenses", detailType: "Insurance" },
  { name: "Interest expense", type: "Expenses", detailType: "Interest paid" },
  { name: "Job Materials", type: "Expenses", detailType: "Supplies" },
  { name: "Legal and professional fees", type: "Expenses", detailType: "Legal and professional fees" },
  { name: "Meals and entertainment", type: "Expenses", detailType: "Meals and entertainment" },
  { name: "Office expenses", type: "Expenses", detailType: "Office/General Administrative Expenses" },
  { name: "Other general and administrative expenses", type: "Expenses", detailType: "Office/General Administrative Expenses" },
  { name: "Promotional", type: "Expenses", detailType: "Advertising/Promotional" },
  { name: "QuickBooks Payments Fees", type: "Expenses", detailType: "Other selling expenses" },
  { name: "Rent or lease payments", type: "Expenses", detailType: "Rent or Lease of Buildings" },
  { name: "Repair and maintenance", type: "Expenses", detailType: "Office/General Administrative Expenses" },
  { name: "Shipping and delivery expense", type: "Expenses", detailType: "Shipping, Freight, and Delivery" },
  { name: "Stationery and printing", type: "Expenses", detailType: "Office/General Administrative Expenses" },
  { name: "Stripe Fee", type: "Expenses", detailType: "Bank charges" },
  { name: "Subcontractors", type: "Expenses", detailType: "Cost of Labour" },
  { name: "Supplies", type: "Expenses", detailType: "Supplies" },
  { name: "Taxes and Licenses", type: "Expenses", detailType: "Taxes Paid" },
  { name: "Tools", type: "Expenses", detailType: "Supplies" },
  { name: "Travel", type: "Expenses", detailType: "Travel" },
  { name: "Travel meals", type: "Expenses", detailType: "Travel meals" },
  { name: "Uncategorized Expense", type: "Expenses", detailType: "Other Miscellaneous Service Cost" },
  { name: "Utilities", type: "Expenses", detailType: "Utilities" },
  { name: "Interest earned", type: "Other Income", detailType: "Interest earned" },
  { name: "Other Ordinary Income", type: "Other Income", detailType: "Income" },
  { name: "Other Portfolio Income", type: "Other Income", detailType: "Income" },
  { name: "Miscellaneous", type: "Other Expense", detailType: "Other Miscellaneous Expense" },
  { name: "Penalties and settlements", type: "Other Expense", detailType: "Penalties and settlements" },
  { name: "Reconciliation Discrepancies", type: "Other Expense", detailType: "Other Miscellaneous Expense" },
];

export const suppliers = [
  { name: "QuickBooks Payments", company: "", phone: "", email: "", balance: 0 },
];

export const supplierSummary = {
  overdue: 0, overdueAmount: 0,
  openBills: 0, openBillsAmount: 0,
  paidLast30: 1, paidLast30Amount: 17.95,
};

export const salesTax = {
  agency: "Canada Revenue Agency",
  amount: 70.20,
  period: "January 1 - December 31, 2026",
  collectedOnSales: 70.20,
  paidOnPurchases: 0,
  adjustment: 0,
};

export const navigationItems = {
  main: [
    { id: "create", label: "Create", icon: "Plus" },
    { id: "bookmarks", label: "Bookmarks", icon: "Bookmark" },
    { id: "home", label: "Home", icon: "Home" },
    { id: "feed", label: "Feed", icon: "Rss" },
    { id: "reports", label: "Reports", icon: "BarChart3" },
    { id: "my-apps", label: "My apps", icon: "LayoutGrid" },
  ],
  shortcuts: [
    { label: "Accounting", icon: "Calculator", color: "#0077C5" },
    { label: "Expenses & Pay Bills", icon: "CreditCard", color: "#2CA01C" },
    { label: "Sales & Get Paid", icon: "DollarSign", color: "#0077C5" },
    { label: "Customers", icon: "Users", color: "#2CA01C" },
    { label: "Team", icon: "UserPlus", color: "#0097A7" },
    { label: "Sales Tax", icon: "Receipt", color: "#D4380D" },
    { label: "Payroll", icon: "Globe", color: "#0077C5" },
    { label: "Marketing", icon: "Megaphone", color: "#2CA01C" },
  ],
  quickActions: [
    "Create invoice",
    "Get paid online",
    "Record expense",
    "Add bank deposit",
    "Create cheque",
  ],
};

export const reportCategories = [
  {
    title: "Favourites",
    reports: ["Accounts receivable aging summary", "Balance Sheet", "Profit and Loss"],
  },
  {
    title: "Business overview",
    reports: ["Audit Log", "Balance Sheet", "Balance Sheet Comparison", "Balance Sheet Detail", "Statement of Cash Flows", "Statement of Changes in Equity", "Profit and Loss", "Profit and Loss by Customer", "Profit and Loss by Month"],
  },
  {
    title: "Who owes you",
    reports: ["Accounts receivable aging summary", "Accounts receivable aging detail", "Collections Report", "Customer Balance Summary", "Invoice List", "Open Invoices"],
  },
  {
    title: "Sales and customers",
    reports: ["Sales by Customer Summary", "Sales by Customer Detail", "Sales by Product/Service Summary", "Customer Contact List", "Income by Customer Summary"],
  },
  {
    title: "What you owe",
    reports: ["Accounts payable aging summary", "Accounts payable aging detail", "Unpaid Bills", "Supplier Balance Summary"],
  },
  {
    title: "Expenses and suppliers",
    reports: ["Cheque Detail", "Expenses by Supplier Summary", "Supplier Contact List", "Transaction List by Supplier"],
  },
  {
    title: "Sales tax",
    reports: ["GST/HST Detail Report", "GST/HST Summary Report", "Taxable Sales Summary", "Transaction Detail by Tax Code"],
  },
  {
    title: "For my accountant",
    reports: ["Account List", "General Ledger", "Journal", "Trial Balance", "Reconciliation Reports", "Transaction List by Date"],
  },
];
