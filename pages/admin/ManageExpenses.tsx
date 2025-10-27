
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Expense } from '../../types';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { formatCurrency } from '../../utils/helpers';

const ExpenseForm: React.FC<{ expense: Expense | null, onSave: (expense: Omit<Expense, 'id'>) => void, onCancel: () => void }> = ({ expense, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        item: '', cost: 0, date: new Date().toISOString().split('T')[0], description: '', ...expense
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // @ts-ignore
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Item" id="item" name="item" value={formData.item} onChange={handleChange} required />
            <Input label="Cost" id="cost" name="cost" type="number" value={formData.cost} onChange={handleChange} required />
            <Input label="Date" id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save</button>
            </div>
        </form>
    );
};


const ManageExpenses: React.FC = () => {
    const { expenses, addExpense, updateExpense, deleteExpense } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const handleOpenModal = (expense: Expense | null = null) => {
        setSelectedExpense(expense);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedExpense(null);
    };

    const handleSave = async (expenseData: Omit<Expense, 'id'>) => {
        if (selectedExpense) {
            await updateExpense(selectedExpense.id, expenseData);
        } else {
            await addExpense(expenseData);
        }
        handleCloseModal();
    };

    const openDeleteConfirm = (expense: Expense) => {
        setSelectedExpense(expense);
        setIsDeleteModal(true);
    };

    const handleDelete = async () => {
        if (selectedExpense) {
            await deleteExpense(selectedExpense.id);
        }
        setIsDeleteModal(false);
        setSelectedExpense(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Manage Expenses</h2>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"><i className="fas fa-plus mr-2"></i>Add Expense</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Item</th>
                            <th scope="col" className="px-6 py-3">Cost</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Description</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(expense => (
                            <tr key={expense.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{expense.item}</td>
                                <td className="px-6 py-4">{formatCurrency(expense.cost)}</td>
                                <td className="px-6 py-4">{expense.date}</td>
                                <td className="px-6 py-4">{expense.description}</td>
                                <td className="px-6 py-4 flex space-x-2">
                                    <button onClick={() => handleOpenModal(expense)} className="text-yellow-600 hover:text-yellow-800" title="Edit"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => openDeleteConfirm(expense)} className="text-red-600 hover:text-red-800" title="Delete"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedExpense ? 'Edit Expense' : 'Add Expense'}>
                <ExpenseForm expense={selectedExpense} onSave={handleSave} onCancel={handleCloseModal} />
            </Modal>
             <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)} title="Confirm Deletion">
                <div>
                    <p>Are you sure you want to delete this expense: <strong>{selectedExpense?.item}</strong>?</p>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button onClick={() => setIsDeleteModal(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageExpenses;
