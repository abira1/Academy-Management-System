
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Expense } from '../../types';
import Input from '../../components/ui/Input';
import { formatCurrency } from '../../utils/helpers';

const ReceptionExpenses: React.FC = () => {
    const { expenses, addExpense } = useData();
    const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
        item: '', cost: 0, date: new Date().toISOString().split('T')[0], description: ''
    });
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // @ts-ignore
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addExpense(formData);
        setSuccessMessage('Expense added successfully!');
        setFormData({ item: '', cost: 0, date: new Date().toISOString().split('T')[0], description: '' });
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Expense</h2>
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Item" id="item" name="item" value={formData.item} onChange={handleChange} required />
                    <Input label="Cost" id="cost" name="cost" type="number" value={formData.cost} onChange={handleChange} required />
                    <Input label="Date" id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                    </div>
                    {successMessage && <p className="text-green-600 bg-green-100 p-3 rounded-md">{successMessage}</p>}
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">Add Expense</button>
                    </div>
                </form>
            </div>
             <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Expenses</h2>
                <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Item</th>
                                <th scope="col" className="px-6 py-3">Cost</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.slice(0).reverse().map(expense => (
                                <tr key={expense.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{expense.item}</td>
                                    <td className="px-6 py-4">{formatCurrency(expense.cost)}</td>
                                    <td className="px-6 py-4">{expense.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReceptionExpenses;
