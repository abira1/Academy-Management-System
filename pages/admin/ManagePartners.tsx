import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Partner } from '../../types';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const PartnerForm: React.FC<{ partner: Partner | null, onSave: (partner: Omit<Partner, 'id'>) => void, onCancel: () => void }> = ({ partner, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        username: '', sharePercentage: 0, password: '', ...partner
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
            <Input label="Username" id="username" name="username" value={formData.username} onChange={handleChange} required />
            <Input label="Password" id="password" name="password" type="password" value={formData.password} onChange={handleChange} required={!partner} placeholder={partner ? "Leave blank to keep unchanged" : ""} />
            <Input label="Share %" id="sharePercentage" name="sharePercentage" type="number" value={formData.sharePercentage} onChange={handleChange} required />
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save</button>
            </div>
        </form>
    );
};

const ManagePartners: React.FC = () => {
    const { partners, addPartner, updatePartner, deletePartner } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const handleOpenModal = (partner: Partner | null = null) => {
        setSelectedPartner(partner);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPartner(null);
    };

    const handleSave = async (partnerData: any) => {
        if (selectedPartner) {
            const data = { ...partnerData };
            if (!data.password) { // if password field is empty string, don't update it
                delete data.password;
            }
            await updatePartner(selectedPartner.id, data);
        } else {
            await addPartner(partnerData);
        }
        handleCloseModal();
    };

    const openDeleteConfirm = (partner: Partner) => {
        setSelectedPartner(partner);
        setIsDeleteModal(true);
    };

    const handleDelete = async () => {
        if (selectedPartner) {
            await deletePartner(selectedPartner.id);
        }
        setIsDeleteModal(false);
        setSelectedPartner(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Manage Partners</h2>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"><i className="fas fa-plus mr-2"></i>Add Partner</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Username</th>
                            <th scope="col" className="px-6 py-3">Share %</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partners.map(partner => (
                            <tr key={partner.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{partner.username}</td>
                                <td className="px-6 py-4">{partner.sharePercentage}%</td>
                                <td className="px-6 py-4 flex space-x-2">
                                    <button onClick={() => handleOpenModal(partner)} className="text-yellow-600 hover:text-yellow-800" title="Edit"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => openDeleteConfirm(partner)} className="text-red-600 hover:text-red-800" title="Delete"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedPartner ? 'Edit Partner' : 'Add Partner'}>
                <PartnerForm partner={selectedPartner} onSave={handleSave} onCancel={handleCloseModal} />
            </Modal>
             <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)} title="Confirm Deletion">
                <div>
                    <p>Are you sure you want to delete this partner: <strong>{selectedPartner?.username}</strong>?</p>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button onClick={() => setIsDeleteModal(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManagePartners;