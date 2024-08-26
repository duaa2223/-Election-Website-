// import  { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// function AddPartyList() {
//   const { listType } = useParams();
//   const navigate = useNavigate();
//   const [listName, setListName] = useState('');
//   const [nationalId, setNationalId] = useState('');
//   const [members, setMembers] = useState([]);

//   const addMember = () => {
//     if (nationalId.trim()) {
//       setMembers([...members, { id: Date.now(), nationalId }]);
//       setNationalId('');
//     }
//   };

//   const removeMember = (id) => {
//     setMembers(members.filter(member => member.id !== id));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // هنا يمكنك إضافة المنطق لحفظ القائمة في قاعدة البيانات
//     console.log('تم حفظ القائمة:', { listName, members, type: listType });
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-blue-100 to-green-100 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto overflow-hidden bg-white shadow-md rounded-xl">
//         <div className="p-8">
//           <h2 className="mb-6 text-2xl font-bold text-center">
//             {listType === 'party' ? 'إضافة قائمة حزبية' : 'إضافة قائمة محلية'}
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="listName" className="block text-sm font-medium text-gray-700">اسم القائمة</label>
//               <input
//                 type="text"
//                 id="listName"
//                 value={listName}
//                 onChange={(e) => setListName(e.target.value)}
//                 className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">الرقم الوطني للعضو</label>
//               <div className="flex mt-1 rounded-md shadow-sm">
//                 <input
//                   type="text"
//                   id="nationalId"
//                   value={nationalId}
//                   onChange={(e) => setNationalId(e.target.value)}
//                   className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={addMember}
//                   className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-l-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                   إضافة
//                 </button>
//               </div>
//             </div>
//             <ul className="divide-y divide-gray-200">
//               {members.map((member) => (
//                 <li key={member.id} className="flex items-center justify-between py-4">
//                   <span>{member.nationalId}</span>
//                   <button
//                     type="button"
//                     onClick={() => removeMember(member.id)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     حذف
//                   </button>
//                 </li>
//               ))}
//             </ul>
//             <div>
//               <button
//                 type="submit"
//                 className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 حفظ القائمة
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddPartyList;
//---------------------------------------------------------------------------
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import axios from "axios";

function AddPartyList() {
  const [gender, setGender] = useState("");
  const [nationalID, setNationalId] = useState("");
  const [Name, setListName] = useState("");
  // const [partyListingID, setPartyID] = useState('');
  const [members, setMembers] = useState([]);
  // const [candidacyCourse, setCandidacyCourse] = useState('');

  // Function to fetch citizen information
  const getCitizen = async (nationalID) => {
    try {
      const response3 = await axios.get(
        `http://localhost:4026/api/LocalList/getCitizen/${nationalID}`
      );
      console.log("citizen", response3.data);

      // Add citizen to members list
      setMembers((prevMembers) => [...prevMembers, response3.data.citizen]);
    } catch (error) {
      console.error("Error fetching citizen information", error);
    }
  };

  // Function to handle form submission and add party listing
  const handleAddPartyList = async (e) => {
    e.preventDefault();
    if (!Name || !gender || !nationalID) {
      alert("يرجى تعبئة جميع الحقول.");
      return;
    }

    try {
      // Correct the URL for the API request
      const response1 = await axios.post(
        "http://localhost:4026/api/PartyListing/createPartyListing",
        {
          Name,
        }
      );
      console.log("PartyListingID", response1.data.partyID);
      const partyListId = response1.data.partyID;
      // setPartyID(partyListId);

      // Ensure partyListingID is valid
      if (!partyListId) {
        alert("الرقم التعريفي للقائمة غير صحيح.");
        return;
      }

      const response2 = await axios.post(
        "http://localhost:4026/api/PartyListing/partyListingInformation",
        {
          nationalID,
          gender,
        }
      );
      console.log("partyListingInformation", response2);

      if (response1.status === 201 && response2.status === 201) {
        alert("تمت إضافة المعلومات بنجاح.");
        setNationalId("");
        setGender("");
        setListName("");
        await getCitizen(nationalID);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error ===
          "Citizen with this nationalID does not exist"
      ) {
        alert("هذا المواطن مرشح بالفعل أو الرقم الوطني غير موجود.");
      } else {
        console.error("حدث خطأ أثناء إضافة المعلومات:", error);
        alert("حدث خطأ، يرجى المحاولة مرة أخرى.");
      }
    }
  };

  // Function to delete a citizen from the local list
  const deleteCitizenLocaList = async (nationalID) => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا العضو؟");

    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:4026/api/PartyListing/deleteCitizenPartyList/${nationalID}`
      );

      if (response.status === 200) {
        alert("تم حذف العضو بنجاح");
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.nationalID !== nationalID)
        );
      } else {
        alert("حدث خطأ غير متوقع. حالة الاستجابة:", response.status);
      }
    } catch (error) {
      console.error("Error deleting citizen from local list:", error);
      alert("حدث خطأ أثناء حذف العضو.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-white sm:px-6 lg:px-8 font-amiri">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-extrabold text-gray-900">
            إدارة القائمة الحزبية
          </h1>
        </div>

        <div className="mb-8 overflow-hidden bg-white shadow-xl text-end">
          <div className="p-6 space-y-4">
            <form onSubmit={handleAddPartyList}>
              <input
                type="text"
                value={Name}
                onChange={(e) => setListName(e.target.value)}
                placeholder="اسم القائمة"
                className="w-full p-3 transition duration-200 border-2 border-gray-300 outline-none focus:border-red-500 focus:ring focus:ring-red-200 text-end"
              />

              <input
                type="text"
                value={nationalID}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="الرقم الوطني للعضو"
                className="w-full p-3 mt-4 transition duration-200 border-2 border-gray-300 outline-none focus:border-red-500 focus:ring focus:ring-red-200"
              />
              <div className="mt-4">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  الجنس
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="block w-full p-3 mt-1 border-2 border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring focus:ring-red-200"
                >
                  <option value="">اختر الجنس</option>
                  <option value="Male">ذكر</option>
                  <option value="Female">أنثى</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-2">
                <button
                  type="submit"
                  className="inline-block bg-[#166534] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-300 hover:bg-[#15803d]"
                >
                  اضافة
                </button>
                <button
                  type="button"
                  className="inline-block bg-[#CE1126] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-300 hover:bg-[#A50E1F]"
                >
                  إلغاء
                </button>
              </div>
            </form>

            <div className="flex justify-center my-6">
              <button className="inline-block bg-[#166534] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-300 hover:bg-[#15803d] w-44">
                اعتماد القائمة
              </button>
            </div>

            <h1 className="mt-3 text-lg font-bold text-center">الأعضاء</h1>

            <div className="flex flex-wrap justify-center gap-4 mt-12">
              {members.length > 0 ? (
                members.map((member, index) => (
                  <div
                    key={index}
                    className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow w-80 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {member.name || "اسم غير متاح"}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {member.nationalID || "الرقم الوطني غير متاح"} :الرقم
                      الوطني
                    </p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {member.email || "الايميل غير متاح"}
                    </p>
                    <div className="flex justify-end gap-5 cursor-pointer">
                      <MdDelete
                        onClick={() => deleteCitizenLocaList(member.nationalID)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>لا يوجد أعضاء بعد.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPartyList;
