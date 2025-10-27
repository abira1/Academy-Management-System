
import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/ui/Card';
import { formatCurrency, exportToPDF, exportToExcel } from '../../utils/helpers';

const PartnerDashboard: React.FC = () => {
    const { user } = useAuth();
    const { partners, students, expenses, teachers } = useData();
    
    const partnerInfo = partners.find(p => p.id === user?.partnerId);

    const { monthlyProfit, yearlyIncome } = useMemo(() => {
        if (!partnerInfo) return { monthlyProfit: 0, yearlyIncome: 0 };
        
        const totalIncome = students.reduce((acc, student) => acc + student.paid, 0);
        const totalExpenses = expenses.reduce((acc, expense) => acc + expense.cost, 0) + teachers.reduce((acc, teacher) => acc + teacher.salary, 0);
        const netProfit = totalIncome - totalExpenses;

        const currentMonth = new Date().getMonth();
        // This is a simplified calculation. A real app would segregate income/expense by month.
        const thisMonthNetProfit = netProfit / (currentMonth + 1); 

        const partnerShare = partnerInfo.sharePercentage / 100;

        return {
            monthlyProfit: thisMonthNetProfit * partnerShare,
            yearlyIncome: netProfit * partnerShare,
        };

    }, [partnerInfo, students, expenses, teachers]);
    
    if (!partnerInfo) {
        return <div className="text-center text-red-500">Could not find partner information.</div>;
    }

    const handleExport = (type: 'pdf' | 'excel') => {
        const title = `${partnerInfo.username}'s Financial Statement`;
        const data = [
            { "Metric": "Share Percentage", "Value": `${partnerInfo.sharePercentage}%` },
            { "Metric": "This Month's Profit", "Value": formatCurrency(monthlyProfit) },
            { "Metric": "Total Yearly Income", "Value": formatCurrency(yearlyIncome) },
        ];
        if(type === 'pdf') {
            const columns = ["Metric", "Value"];
            const body = data.map(d => [d.Metric, d.Value]);
            exportToPDF(columns, body, title, `partner_statement_${user?.username}`);
        } else {
            exportToExcel(data, `partner_statement_${user?.username}`);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card title="Your Share" value={`${partnerInfo.sharePercentage}%`} icon="fa-pie-chart" color="bg-blue-500" />
                <Card title="This Month's Profit" value={formatCurrency(monthlyProfit)} icon="fa-calendar-day" color="bg-green-500" />
                <Card title="Total Yearly Income" value={formatCurrency(yearlyIncome)} icon="fa-landmark" color="bg-purple-500" />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Financial Overview</h2>
                        <p className="text-gray-500 mt-1">Here is a summary of your earnings.</p>
                    </div>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        <button onClick={() => handleExport('pdf')} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"><i className="fas fa-file-pdf mr-2"></i>Download PDF</button>
                        <button onClick={() => handleExport('excel')} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"><i className="fas fa-file-excel mr-2"></i>Download Excel</button>
                    </div>
                </div>
                <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Withdrawal Information</h3>
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">Withdrawal Available Soon</p>
                        <p>You can withdraw your profit after completing 1 year with the academy. Please contact the admin for more details.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerDashboard;
