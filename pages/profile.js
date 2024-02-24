import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Select from 'react-select';
import TranscriptUploader from '../components/TranscriptUploader';
import {
  useAppContext
} from './context/Context';

const yearOptions = [
  { value: 'freshman', label: 'Freshman' },
  { value: 'sophomore', label: 'Sophomore' },
  { value: 'junior', label: 'Junior' },
  { value: 'senior', label: 'Senior' },
];

// Example options for concentration and secondary. Replace with actual data.
const concentrationOptions = [
  { value: 'computerScience', label: 'Computer Science' },
  { value: 'biology', label: 'Biology' },
  { value: 'history', label: 'History' },
  { value: 'economics', label: 'Economics' },
  { value: 'statistics', label: 'Statistics' },
  // Add more options...
];

export default function Profile() {

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedConcentration, setSelectedConcentration] = useState(null);
  const [selectedSecondary, setSelectedSecondary] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const { setTranscript, setProfile
  } = useAppContext();

  const onUploadComplete = (data) => {
    setTranscript(data);
  }

  const router = useRouter();

  const handleSubmit = (event) => {
    const userProfile = {
      year: selectedYear ? selectedYear.value : '',
      concentration: selectedConcentration ? selectedConcentration.value : '',
      secondary: selectedSecondary ? selectedSecondary.value : '',
      additionalInfo,
    };
    setProfile(userProfile);
    event.preventDefault();
    router.push('/courses');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Fill in Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Let's get some information to customize your academic plan.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <TranscriptUploader onUploadComplete={onUploadComplete} />
            <div>
              <label htmlFor="year" className="block mb-2 mt-5 text-sm font-medium text-gray-700">Current Year</label>
              <Select
                options={yearOptions}
                onChange={setSelectedYear}
                placeholder="Select Current Year"
                isClearable
              />
            </div>
            <div>
              <label htmlFor="concentration" className="block mb-2 mt-5 text-sm font-medium text-gray-700">Concentration</label>
              <Select
                options={concentrationOptions}
                onChange={setSelectedConcentration}
                placeholder="Select Concentration"
                isClearable
                isSearchable
              />
            </div>
            <div>
              <label htmlFor="secondary" className="block mb-2 mt-5 text-sm font-medium text-gray-700">Secondary Field (Optional)</label>
              <Select
                options={concentrationOptions} // Assuming the same options as concentration for example
                onChange={setSelectedSecondary}
                placeholder="Select Secondary"
                isClearable
                isSearchable
              />
            </div>
            <div>
              <label htmlFor="additionalInfo" className="block mb-2 mt-5 text-sm font-medium text-gray-700">Additional Information</label>
              <textarea
                type="text"
                id="additionalInfo"
                name="additionalInfo"
                className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Add anything else you want (academic interests, career goals, etc.)"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />

            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
