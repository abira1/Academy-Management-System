
import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Student } from '../../types';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { formatCurrency } from '../../utils/helpers';

const AdmissionForm: React.FC<{ student: Student | null, onSave: (student: any) => void, onCancel: () => void }> = ({ student, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '', studentId: '', phone: '', course: '', totalPayment: 0, paid: 0, ...student
    });

     useEffect(() => {
        const initialData = { name: '', studentId: '', phone: '', course: '', totalPayment: 0, paid: 0, ...student };
        setFormData(initialData);
    }, [student]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const due = formData.totalPayment - formData.paid;
        onSave({ ...formData, due });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Student ID" id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} required />
            <Input label="Phone" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            <Input label="Course" id="course" name="course" value={formData.course} onChange={handleChange} required />
            <Input label="Total Payment" id="totalPayment" name="totalPayment" type="number" value={formData.totalPayment} onChange={handleChange} required />
            <Input label="Paid Amount" id="paid" name="paid" type="number" value={formData.paid} onChange={handleChange} required />
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Admission</button>
            </div>
        </form>
    );
};

const AddAdmission: React.FC = () => {
    const { students, addStudent, updateStudent } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);

    const handleOpenModal = (mode: 'add' | 'edit', student: Student | null = null) => {
        setModalMode(mode);
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
        setModalMode(null);
    };

    const handleSave = async (studentData: any) => {
        if (modalMode === 'add') {
            await addStudent(studentData);
        } else if (modalMode === 'edit' && selectedStudent) {
            await updateStudent(selectedStudent.id, studentData);
        }
        handleCloseModal();
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Student Admissions</h2>
                <button onClick={() => handleOpenModal('add')} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"><i className="fas fa-plus mr-2"></i>New Admission</button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Student ID</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Course</th>
                            <th scope="col" className="px-6 py-3">Due</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{student.studentId}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                                <td className="px-6 py-4">{student.course}</td>
                                <td className="px-6 py-4 text-red-600">{formatCurrency(student.due)}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleOpenModal('edit', student)} className="text-yellow-600 hover:text-yellow-800" title="Edit/Update Payment"><i className="fas fa-edit"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={modalMode === 'add' ? 'New Student Admission' : 'Update Student Payment'}>
                <AdmissionForm student={selectedStudent} onSave={handleSave} onCancel={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default AddAdmission;
