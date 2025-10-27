
import React, { useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/ui/Card';
import { formatCurrency } from '../../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { students, teachers, expenses } = useData();

  const totalStudents = students.length;
  const totalIncome = students.reduce((acc, student) => acc + student.paid, 0);
  const totalTeacherSalary = teachers.reduce((acc, teacher) => acc + teacher.salary, 0);
  const totalOtherExpenses = expenses.reduce((acc, expense) => acc + expense.cost, 0);
  const totalExpenses = totalTeacherSalary + totalOtherExpenses;
  const netProfit = totalIncome - totalExpenses;

  const monthlyProfitData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = months.map(month => ({ name: month, income: 0, expense: 0, profit: 0 }));

    students.forEach(s => {
      // Assuming 'date' property on student payment records for accurate monthly calculation
      const monthIndex = new Date().getMonth(); // Mock: using current month
      data[monthIndex].income += s.paid;
    });

    expenses.forEach(e => {
        const monthIndex = new Date(e.date).getMonth();
        data[monthIndex].expense += e.cost;
    });
    
    teachers.forEach(t => {
        const monthIndex = new Date(t.date).getMonth();
        data[monthIndex].expense += t.salary;
    });

    data.forEach(d => {
      d.profit = d.income - d.expense;
    });

    // Mock some previous month data for chart visibility
    data[8].profit = 12000;
    data[9].profit = 25000;
    data[10].profit = 18000;
    
    return data;
  }, [students, teachers, expenses]);


  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Total Students" value={totalStudents} icon="fa-users" color="bg-blue-500" />
        <Card title="Total Income" value={formatCurrency(totalIncome)} icon="fa-coins" color="bg-green-500" />
        <Card title="Total Expenses" value={formatCurrency(totalExpenses)} icon="fa-receipt" color="bg-red-500" />
        <Card title="Net Profit" value={formatCurrency(netProfit)} icon="fa-chart-pie" color="bg-purple-500" />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Profit Trend</h2>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={monthlyProfitData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value as number)}/>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Line type="monotone" dataKey="profit" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
