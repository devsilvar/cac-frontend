import React from 'react';
import SiteLayout from '../layouts/SiteLayout';

const Docs: React.FC = () => {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000';
  return (
    <SiteLayout>
      <div className='py-16 max-w-5xl mx-auto'>
        <h1 className='text-4xl font-bold text-gray-900 mb-6'>
          Customer API Documentation
        </h1>
        <p className='text-gray-600 mb-8'>
          Everything you need to authenticate, generate API keys, and call the
          Business endpoints.
        </p>

        <div className='space-y-10'>
          {/* Quick Start */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 mb-3'>
              Quick Start
            </h2>
            <ol className='list-decimal pl-6 space-y-2 text-gray-700'>
              <li>
                Sign up for a customer account at{' '}
                <code className='px-1.5 py-0.5 bg-gray-100 rounded'>
                  /customer/signup
                </code>{' '}
                (plan is optional).
              </li>
              <li>
                Log in at{' '}
                <code className='px-1.5 py-0.5 bg-gray-100 rounded'>
                  /customer/login
                </code>{' '}
                to access your portal.
              </li>
              <li>
                Create an API key at{' '}
                <code className='px-1.5 py-0.5 bg-gray-100 rounded'>
                  /customer/api-keys
                </code>
                . Copy the plaintext key (ck_...) shown once.
              </li>
              <li>
                Call the Business API endpoints using the <strong>Token</strong>{' '}
                scheme in the Authorization header.
              </li>
            </ol>
          </section>

          {/* Auth */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 mb-3'>
              Authentication
            </h2>
            <p className='text-gray-600 mb-3'>
              Use your customer API key (ck_...) with the Token scheme in the
              Authorization header.
            </p>
            <pre className='bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm'>{`Authorization: Token ck_YOUR_API_KEY`}</pre>
            <p className='text-gray-600 mt-3 text-sm'>
              Note: Admin JWTs use the Bearer scheme and are for admin-only
              routes.
            </p>
          </section>

          {/* Business Endpoints */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 mb-3'>
              Endpoints (Business)
            </h2>
            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Name Search
                </h3>
                <p className='text-gray-600 text-sm mb-2'>
                  POST{' '}
                  <code className='px-1.5 py-0.5 bg-gray-100 rounded'>
                    /api/v1/name-search
                  </code>
                </p>
                <pre className='bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm'>{`curl -X POST ${origin}/api/v1/name-search \
  -H "Authorization: Token ck_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"SearchType":"ALL","searchTerm":"DANGOTE","maxResults":3}'`}</pre>
              </div>

              <div>
                <h3 className="\'text-lg font-semibold text-gray-900\">
                  Name Similarity (Deprecated – use Name Search)
                </h3>
                <p className='text-gray-600 text-sm mb-2'>
                  POST{' '}
                  <code className='px-1.5 py-0.5 bg-gray-100 rounded'>
                    /api/v1/name-search
                  </code>
                </p>
                <pre className='bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm'>{`# curl -X POST ${origin}/api/v1/name-search \
  -H "Authorization: Token ck_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"SearchType":"ALL","searchTerm":"DANGOTE","maxResults":3}'`}</pre>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Business Registration
                </h3>
                <p className='text-gray-600 text-sm mb-2'>
                  POST{' '}
                  <code className='px-1.5 py-0.5 bg-gray-100 rounded'>
                    /api/v1/business/register
                  </code>
                </p>
                <pre className='bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm'>{`curl -X POST ${origin}/api/v1/business/register \
  -H "Authorization: Token ck_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"ref":"REF12345","full_name":"John Doe","business_name1":"ACME GLOBAL LTD","business_name2":"ACME GLOBAL LIMITED","nature_of_business":"General trading","date_of_birth":"01-01-1990","email":"you@example.com","phone":"08012345678","image_id_card":"data:image/png;base64,AAAA","image_passport":"data:image/png;base64,AAAA","image_signature":"data:image/png;base64,AAAA"}'`}</pre>
              </div>
            </div>
          </section>

          {/* Portal Endpoints */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 mb-3'>
              Portal Endpoints
            </h2>
            <ul className='list-disc pl-6 text-gray-700 space-y-1'>
              <li>
                GET/POST/DELETE{' '}
                <code className='px-1.5 py-0.5 bg-gray-100 rounded'>
                  /api/v1/customer/api-keys
                </code>{' '}
                — manage your API keys
              </li>
              <li>
                GET{' '}
                <code className='px-1.5 py-0.5 bg-gray-100 rounded'>
                  /api/v1/customer/usage
                </code>{' '}
                — usage summary
              </li>
            </ul>
          </section>

          {/* Errors */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 mb-3'>
              Errors
            </h2>
            <p className='text-gray-600 text-sm'>
              Errors follow a common JSON shape:
            </p>
            <pre className='bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm'>{`{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or expired customer API key"
  }
}`}</pre>
          </section>

          {/* Docs & Sandbox */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 mb-3'>
              Docs & Sandbox
            </h2>
            <p className='text-gray-600 text-sm mb-2'>
              Explore the OpenAPI (Swagger) documentation and test requests in
              the browser.
            </p>
            <ul className='list-disc pl-6 text-gray-700 space-y-1'>
              <li>
                <a
                  className='text-blue-600 hover:underline'
                  href='/docs/api'
                  target='_blank'
                  rel='noreferrer'
                >
                  Swagger UI
                </a>{' '}
                — includes Public and Dev/Debug APIs
              </li>
            </ul>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
};

export default Docs;
