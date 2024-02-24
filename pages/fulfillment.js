import React, { useEffect, useState } from 'react';
import { useAppContext } from './context/Context';
import { ThreeDots } from 'react-loader-spinner';
import { useRouter } from 'next/router';

function RequirementFulfillmentPage() {
  const [fulfillments, setFulfillments] = useState(null);
  const { courses, profile } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!profile.concentration) {
          router.push('/profile');
          return;
        }
        if (!courses) {
          router.push('/courses');
          return;
        }
        const response = await fetch('/api/requirements-fulfillment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courses,
            year: profile.year,
            concentration: profile.concentration,
            secondary: profile.secondary,
            additionalInfo: profile.additionalInfo,
          }),
        });
        const data = await response.json();
        setFulfillments(data);
      } catch (error) {
        console.error('Error fetching requirement fulfillments:', error);
      }
    };

    fetchData();
  }, [courses, profile]);

  if (!fulfillments) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center">
          <p className="text-lg font-semibold mb-2">Analyzing what concentration requirements you've fulfilled...</p>
          <ThreeDots color="#00BFFF" height={80} width={80} />
        </div>
      </div>
    );
  }

  const renderNote = (note) => (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
      <p className="font-bold">Please Note</p>
      <p>{note}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4" style={{ maxWidth: '60em' }}>
      <h1 className="text-3xl font-bold mb-6 text-center">Concentration Requirements Fulfilled</h1>
      {fulfillments.notes && renderNote(fulfillments.notes)}
      {Object.keys(fulfillments).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(fulfillments).map(([requirement, courseCode], index) => (
            requirement !== 'notes' && (
              <div key={index} className={`flex justify-between items-center rounded-md p-3 shadow ${courseCode ? 'bg-green-100' : 'bg-red-100'}`}>
                <span className="font-semibold">{requirement}</span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${courseCode ? 'bg-blue-100 text-blue-800' : 'text-gray-500'}`}>
                  {courseCode || 'Requirement not fulfilled'}
                </span>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="text-center text-xl">No requirements found.</div>
      )}
    </div>
  );
}

export default RequirementFulfillmentPage;
