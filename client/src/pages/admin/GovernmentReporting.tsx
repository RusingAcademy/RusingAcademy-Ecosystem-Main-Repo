/**
 * GovernmentReporting — Admin page for government compliance reporting
 * Sprint C4: Wraps the GovernmentComplianceReport component
 */
import { GovernmentComplianceReport } from "@/components/GovernmentComplianceReport";

export default function GovernmentReporting() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <GovernmentComplianceReport />
    </div>
  );
}
