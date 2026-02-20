import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import Invoices from "./pages/Invoices";
import InvoiceDetail from "./pages/InvoiceDetail";
import InvoicePdf from "./pages/InvoicePdf";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import Expenses from "./pages/Expenses";
import ExpenseDetail from "./pages/ExpenseDetail";
import ChartOfAccounts from "./pages/ChartOfAccounts";
import AccountRegister from "./pages/AccountRegister";
import ProductsServices from "./pages/ProductsServices";
import ProductDetail from "./pages/ProductDetail";
import Suppliers from "./pages/Suppliers";
import SupplierDetail from "./pages/SupplierDetail";
import SalesTax from "./pages/SalesTax";
import Reports from "./pages/Reports";
import ProfitLossReport from "./pages/ProfitLossReport";
import BalanceSheetReport from "./pages/BalanceSheetReport";
import TrialBalanceReport from "./pages/TrialBalanceReport";
import AgingReport from "./pages/AgingReport";
import GeneralLedgerReport from "./pages/GeneralLedgerReport";
import BankTransactions from "./pages/BankTransactions";
import BankRules from "./pages/BankRules";
import JournalEntries from "./pages/JournalEntries";
import Estimates from "./pages/Estimates";
import Bills from "./pages/Bills";
import RecurringTransactions from "./pages/RecurringTransactions";
import Reconciliation from "./pages/Reconciliation";
import ReconciliationWorkspace from "./pages/ReconciliationWorkspace";
import Deposits from "./pages/Deposits";
import AuditLog from "./pages/AuditLog";
import AuditTrail from "./pages/AuditTrail";
import ExchangeRates from "./pages/ExchangeRates";
import Settings from "./pages/Settings";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Home} />
        {/* Invoices */}
        <Route path="/invoices" component={Invoices} />
        <Route path="/invoices/new" component={InvoiceDetail} />
        <Route path="/invoices/:id/pdf" component={InvoicePdf} />
        <Route path="/invoices/:id" component={InvoiceDetail} />
        {/* Estimates */}
        <Route path="/estimates" component={Estimates} />
        <Route path="/estimates/:id" component={Estimates} />
        {/* Customers */}
        <Route path="/customers" component={Customers} />
        <Route path="/customers/new" component={CustomerDetail} />
        <Route path="/customers/:id" component={CustomerDetail} />
        {/* Expenses */}
        <Route path="/expenses" component={Expenses} />
        <Route path="/expenses/new" component={ExpenseDetail} />
        <Route path="/expenses/:id" component={ExpenseDetail} />
        {/* Bills */}
        <Route path="/bills" component={Bills} />
        <Route path="/bills/:id" component={Bills} />
        {/* Chart of Accounts */}
        <Route path="/chart-of-accounts" component={ChartOfAccounts} />
        <Route path="/accounts/:id/register" component={AccountRegister} />
        {/* Products & Services */}
        <Route path="/products-services" component={ProductsServices} />
        <Route path="/products-services/new" component={ProductDetail} />
        <Route path="/products-services/:id" component={ProductDetail} />
        {/* Suppliers */}
        <Route path="/suppliers" component={Suppliers} />
        <Route path="/suppliers/new" component={SupplierDetail} />
        <Route path="/suppliers/:id" component={SupplierDetail} />
        {/* Sales Tax */}
        <Route path="/sales-tax" component={SalesTax} />
        {/* Bank Transactions & Rules */}
        <Route path="/bank-transactions" component={BankTransactions} />
        <Route path="/bank-rules" component={BankRules} />
        {/* Payments & Deposits */}
        <Route path="/deposits" component={Deposits} />
        {/* Recurring Transactions */}
        <Route path="/recurring" component={RecurringTransactions} />
        {/* Reconciliation */}
        <Route path="/reconciliation" component={Reconciliation} />
        <Route path="/reconciliation/workspace" component={ReconciliationWorkspace} />
        {/* Journal Entries */}
        <Route path="/journal-entries" component={JournalEntries} />
        {/* Reports */}
        <Route path="/reports" component={Reports} />
        <Route path="/reports/profit-and-loss" component={ProfitLossReport} />
        <Route path="/reports/balance-sheet" component={BalanceSheetReport} />
        <Route path="/reports/trial-balance" component={TrialBalanceReport} />
        <Route path="/reports/aging" component={AgingReport} />
        <Route path="/reports/general-ledger" component={GeneralLedgerReport} />
        {/* Audit */}
        <Route path="/audit-log" component={AuditLog} />
        <Route path="/audit-trail" component={AuditTrail} />
        {/* Exchange Rates */}
        <Route path="/exchange-rates" component={ExchangeRates} />
        {/* Settings */}
        <Route path="/settings" component={Settings} />
        {/* Fallback */}
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <PWAInstallPrompt />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
