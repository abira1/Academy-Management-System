
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Teacher } from '../../types';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { formatCurrency } from '../../utils/helpers';

const TeacherForm: React.FC<{ teacher: Teacher | null, onSave: (teacher: Omit<Teacher, 'id'>) => void, onCancel: () => void }> = ({ teacher, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '', salary: 0, date: new Date().toISOString().split('T')[0], ...teacher
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Salary" id="salary" name="salary" type="number" value={formData.salary} onChange={handleChange} required />
            <Input label="Date" id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save</button>
            </div>
        </form>
    );
};

const ManageTeachers: React.FC = () => {
    const { teachers, addTeacher, updateTeacher, deleteTeacher } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const handleOpenModal = (teacher: Teacher | null = null) => {
        setSelectedTeacher(teacher);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTeacher(null);
    };

    const handleSave = async (teacherData: Omit<Teacher, 'id'>) => {
        if (selectedTeacher) {
            await updateTeacher(selectedTeacher.id, teacherData);
        } else {
            await addTeacher(teacherData);
        }
        handleCloseModal();
    };

    const openDeleteConfirm = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsDeleteModal(true);
    };

    const handleDelete = async () => {
        if (selectedTeacher) {
            await deleteTeacher(selectedTeacher.id);
        }
        setIsDeleteModal(false);
        setSelectedTeacher(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Manage Teacher Salaries</h2>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"><i className="fas fa-plus mr-2"></i>Add Salary</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Salary</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map(teacher => (
                            <tr key={teacher.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{teacher.name}</td>
                                <td className="px-6 py-4">{formatCurrency(teacher.salary)}</td>
                                <td className="px-6 py-4">{teacher.date}</td>
                                <td className="px-6 py-4 flex space-x-2">
                                    <button onClick={() => handleOpenModal(teacher)} className="text-yellow-600 hover:text-yellow-800" title="Edit"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => openDeleteConfirm(teacher)} className="text-red-600 hover:text-red-800" title="Delete"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedTeacher ? 'Edit Teacher Salary' : 'Add Teacher Salary'}>
                <TeacherForm teacher={selectedTeacher} onSave={handleSave} onCancel={handleCloseModal} />
            </Modal>

            <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)} title="Confirm Deletion">
                <div>
                    <p>Are you sure you want to delete the salary record for <strong>{selectedTeacher?.name}</strong>?</p>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button onClick={() => setIsDeleteModal(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageTeachers;
