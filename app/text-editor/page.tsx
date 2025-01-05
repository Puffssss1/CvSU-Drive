// app/page.js (App Router)
// pages/index.js (Pages Router)
import React from 'react';

import dynamic from 'next/dynamic';

const CustomEditor = dynamic( () => import( '@/app/components/custom-editor' ), { ssr: false } );

function text() {
  return (
  <>
	<CustomEditor />
  </>

    
  );
}

export default text;
