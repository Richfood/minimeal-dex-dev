import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Default component to avoid server-side rendering issues
const Default = dynamic(() => import('../../components/CustomChart/Default'), {
  ssr: false // This ensures that the component is only rendered on the client side
});

const IndexPage = () => {
  return (
    <div>
      <h1>My Chart Page</h1>
      {/* <Default /> */}
    </div>
  );
};

export default IndexPage;
