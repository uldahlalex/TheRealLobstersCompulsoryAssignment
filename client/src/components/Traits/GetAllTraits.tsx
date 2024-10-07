import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { Api } from "../../Api.ts";
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

// Define atoms
const allTraitsAtom = atom<{ id: number, traitName: string }[]>([]);

const GetAllTraits = () => {
    const [allTraits, setAllTraits] = useAtom(allTraitsAtom);

    const api = new Api();

    const fetchTraits = async () => {
        try {
            const response = await api.api.traitGetAllTraits();
            if (Array.isArray(response.data)) {
                const traitsData = response.data.map((item: any) => ({id: item.id, traitName: item.traitName}));
                setAllTraits(traitsData);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching traits:', error);
        }
    };

    useEffect(() => {
        fetchTraits();
    }, [setAllTraits]);

    const handleDeleteAllTrait = async (traitToDelete: { id: number, traitName: string }) => {
        try {
            await api.api.traitDeleteTrait(traitToDelete.id);
            setAllTraits(allTraits.filter(t => t.id !== traitToDelete.id));
        } catch (error) {
            console.error('Error deleting trait:', error);
        }
    };

    const handleUpdateAllTrait = async (index: number) => {
        const updatedTraitName = prompt("Update trait:", allTraits[index].traitName);
        if (updatedTraitName !== null && updatedTraitName.trim()) {
            const updatedTrait = {traitName: updatedTraitName, id: allTraits[index].id};
            try {
                console.log('Updating trait with ID:', allTraits[index].id); // Log the ID being sent
                await api.api.traitUpdateTrait(allTraits[index].id, updatedTrait);
                const updatedAllTraits = [...allTraits];
                updatedAllTraits[index].traitName = updatedTraitName;
                setAllTraits(updatedAllTraits);
            } catch (error) {
                console.error('Error updating trait:', error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center ">

            <div className=" border border-gray-300 rounded p-4 mt-12" >
                <table className="table overflow-x-auto " style={{ maxHeight: '600px', minWidth: '800px' }}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Trait</th>
                        <th>Actions</th>
                        <th className="flex justify-end pl-2 " >
                            <button className="btn btn-success btn-sm mt-1" style={{marginBottom: '4px'}}>
                                Add Trait
                            </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {allTraits.slice(0, 20).map((trait, index) => (
                        <tr key={index}>
                            <th>{index + 1}</th>
                            <td className="pr-20">{trait.traitName}</td>
                            <td className="space-x-4">
                                <button onClick={() => handleUpdateAllTrait(index)} className="mr-2">
                                    <FaPencilAlt/>
                                </button>
                                <button onClick={() => handleDeleteAllTrait(trait)}>
                                    <FaTrash/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <th>#</th>
                        <th>Trait</th>
                        <th>Actions</th>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

export default GetAllTraits;