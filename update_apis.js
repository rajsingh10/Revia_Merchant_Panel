const fs = require('fs');
const path = require('path');

// 1. Update src/store/slices/locationSlice.ts
{
  const filePath = path.join(__dirname, 'src', 'store', 'slices', 'locationSlice.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace fetchCountries
  content = content.replace(
    /export const fetchCountries = createAsyncThunk\([\s\S]*?async \(_, \{ rejectWithValue \}\) => \{[\s\S]*?try \{[\s\S]*?const response = await apiClient\.get\('\/countries'\);[\s\S]*?return response\.data;[\s\S]*?\} catch \(error: any\) \{[\s\S]*?return rejectWithValue\(error\.response\?\.data\?\.message \|\| 'Failed to fetch countries'\);[\s\S]*?\}[\s\S]*?\}\r?\n\);/,
    `export const fetchCountries = createAsyncThunk(
  'location/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      // API commented out for direct access without backend
      // const response = await apiClient.get('/countries');
      // return response.data;
      return [
        { id: 1, name: 'India', code: 'IN', phone_code: '+91' },
        { id: 2, name: 'United States', code: 'US', phone_code: '+1' },
        { id: 3, name: 'United Arab Emirates', code: 'AE', phone_code: '+971' },
        { id: 4, name: 'United Kingdom', code: 'GB', phone_code: '+44' }
      ];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch countries');
    }
  }
);`
  );

  // Replace fetchStates
  content = content.replace(
    /export const fetchStates = createAsyncThunk\([\s\S]*?async \(countryId: string \| number, \{ rejectWithValue \}\) => \{[\s\S]*?try \{[\s\S]*?const response = await apiClient\.get\(`\/countries\/\$\{countryId\}\/states`\);[\s\S]*?return response\.data;[\s\S]*?\} catch \(error: any\) \{[\s\S]*?return rejectWithValue\(error\.response\?\.data\?\.message \|\| 'Failed to fetch states'\);[\s\S]*?\}[\s\S]*?\}\r?\n\);/,
    `export const fetchStates = createAsyncThunk(
  'location/fetchStates',
  async (countryId: string | number, { rejectWithValue }) => {
    try {
      // API commented out for direct access without backend
      // const response = await apiClient.get(\`/countries/\${countryId}/states\`);
      // return response.data;
      return [
        { id: 101, name: 'Gujarat', country_id: 1 },
        { id: 102, name: 'Maharashtra', country_id: 1 },
        { id: 103, name: 'Delhi', country_id: 1 },
        { id: 104, name: 'Karnataka', country_id: 1 },
        { id: 105, name: 'Tamil Nadu', country_id: 1 },
        { id: 201, name: 'California', country_id: 2 },
        { id: 202, name: 'New York', country_id: 2 },
        { id: 203, name: 'Texas', country_id: 2 }
      ];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch states');
    }
  }
);`
  );

  // Replace fetchCities
  content = content.replace(
    /export const fetchCities = createAsyncThunk\([\s\S]*?async \(stateId: string \| number, \{ rejectWithValue \}\) => \{[\s\S]*?try \{[\s\S]*?const response = await apiClient\.get\(`\/states\/\$\{stateId\}\/cities`\);[\s\S]*?return response\.data;[\s\S]*?\} catch \(error: any\) \{[\s\S]*?return rejectWithValue\(error\.response\?\.data\?\.message \|\| 'Failed to fetch cities'\);[\s\S]*?\}[\s\S]*?\}\r?\n\);/,
    `export const fetchCities = createAsyncThunk(
  'location/fetchCities',
  async (stateId: string | number, { rejectWithValue }) => {
    try {
      // API commented out for direct access without backend
      // const response = await apiClient.get(\`/states/\${stateId}/cities\`);
      // return response.data;
      return [
        { id: 1001, name: 'Ahmedabad' },
        { id: 1002, name: 'Surat' },
        { id: 1003, name: 'Mumbai' },
        { id: 1004, name: 'Bengaluru' },
        { id: 1005, name: 'New Delhi' }
      ];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cities');
    }
  }
);`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('locationSlice.ts updated');
}

// 2. Update src/store/slices/authSlice.ts
{
  const filePath = path.join(__dirname, 'src', 'store', 'slices', 'authSlice.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  // requestLoginOtp
  content = content.replace(
    /export const requestLoginOtp = createAsyncThunk\([\s\S]*?async \(identifier: string, \{ rejectWithValue \}\) => \{[\s\S]*?try \{[\s\S]*?const isEmail = identifier\.includes\('@'\);[\s\S]*?const payload = isEmail \? \{ email: identifier \} : \{ phone: identifier \};[\s\S]*?const response = await apiClient\.post\('auth\/request-login-otp', payload\);[\s\S]*?return response\.data;[\s\S]*?\} catch \(error: any\) \{[\s\S]*?return rejectWithValue\(error\.response\?\.data\?\.message \|\| 'Failed to request login OTP'\);[\s\S]*?\}[\s\S]*?\}\r?\n\);/,
    `export const requestLoginOtp = createAsyncThunk(
  'auth/requestLoginOtp',
  async (identifier: string, { rejectWithValue }) => {
    try {
      // Commented out API for direct access without backend
      /*
      const isEmail = identifier.includes('@');
      const payload = isEmail ? { email: identifier } : { phone: identifier };
      const response = await apiClient.post('auth/request-login-otp', payload);
      return response.data;
      */
      return { data: { otp: '123456' }, otp: '123456' };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request login OTP');
    }
  }
);`
  );

  // loginWithOtp
  content = content.replace(
    /export const loginWithOtp = createAsyncThunk\([\s\S]*?async \(data: \{ identifier: string; otp: string \}, \{ rejectWithValue \}\) => \{[\s\S]*?try \{[\s\S]*?const isEmail = data\.identifier\.includes\('@'\);[\s\S]*?const payload = isEmail [\s\S]*?\? \{ email: data\.identifier, otp: data\.otp \} [\s\S]*?: \{ phone: data\.identifier, otp: data\.otp \};[\s\S]*?const response = await apiClient\.post\('auth\/login-with-otp', payload\);[\s\S]*?return response\.data;[\s\S]*?\} catch \(error: any\) \{[\s\S]*?return rejectWithValue\(error\.response\?\.data\?\.message \|\| 'Failed to verify login OTP'\);[\s\S]*?\}[\s\S]*?\}\r?\n\);/,
    `export const loginWithOtp = createAsyncThunk(
  'auth/loginWithOtp',
  async (data: { identifier: string; otp: string }, { rejectWithValue }) => {
    try {
      // Commented out API for direct access without backend
      /*
      const isEmail = data.identifier.includes('@');
      const payload = isEmail 
        ? { email: data.identifier, otp: data.otp } 
        : { phone: data.identifier, otp: data.otp };
      const response = await apiClient.post('auth/login-with-otp', payload);
      return response.data;
      */
      const mockUser = {
        id: 1,
        name: 'Merchant Admin',
        phone: data.identifier,
        email: data.identifier.includes('@') ? data.identifier : 'admin@revia.com',
        role: 'merchant',
        has_business: true,
        admin_approved: true,
        merchant_status: 'approved'
      };
      return {
        data: {
          token: 'mock-merchant-token-revia',
          user: mockUser
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify login OTP');
    }
  }
);`
  );

  // requestRegisterOtp
  content = content.replace(
    /export const requestRegisterOtp = createAsyncThunk\([\s\S]*?async \(identifier: string, \{ rejectWithValue \}\) => \{[\s\S]*?try \{[\s\S]*?const isEmail = identifier\.includes\('@'\);[\s\S]*?const payload = isEmail \? \{ email: identifier \} : \{ phone: identifier \};[\s\S]*?const response = await apiClient\.post\('auth\/merchant\/request-register-otp', payload\);[\s\S]*?return response\.data;[\s\S]*?\} catch \(error: any\) \{[\s\S]*?return rejectWithValue\(error\.response\?\.data\?\.message \|\| 'Failed to request OTP'\);[\s\S]*?\}[\s\S]*?\}\r?\n\);/,
    `export const requestRegisterOtp = createAsyncThunk(
  'auth/requestRegisterOtp',
  async (identifier: string, { rejectWithValue }) => {
    try {
      // Commented out API for direct access without backend
      /*
      const isEmail = identifier.includes('@');
      const payload = isEmail ? { email: identifier } : { phone: identifier };
      const response = await apiClient.post('auth/merchant/request-register-otp', payload);
      return response.data;
      */
      return { data: { otp: '123456' }, otp: '123456', success: true };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request OTP');
    }
  }
);`
  );

  // registerMerchant
  content = content.replace(
    /export const registerMerchant = createAsyncThunk\([\s\S]*?async \(data: \{ identifier: string; otp: string; name\?: string \}, \{ rejectWithValue \}\) => \{[\s\S]*?try \{[\s\S]*?const isEmail = data\.identifier\.includes\('@'\);[\s\S]*?const payload = \{[\s\S]*?otp: data\.otp,[\s\S]*?\.\.\.\(data\.name \? \{ name: data\.name \} : \{\}\),[\s\S]*?\.\.\.\(isEmail \? \{ email: data\.identifier \} : \{ phone: data\.identifier \}\),[\s\S]*?\};[\s\S]*?const response = await apiClient\.post\('auth\/merchant\/register', payload\);[\s\S]*?return response\.data;[\s\S]*?\} catch \(error: any\) \{[\s\S]*?return rejectWithValue\(error\.response\?\.data\?\.message \|\| 'Failed to verify OTP'\);[\s\S]*?\}[\s\S]*?\}\r?\n\);/,
    `export const registerMerchant = createAsyncThunk(
  'auth/registerMerchant',
  async (data: { identifier: string; otp: string; name?: string }, { rejectWithValue }) => {
    try {
      // Commented out API for direct access without backend
      /*
      const isEmail = data.identifier.includes('@');
      const payload = {
        otp: data.otp,
        ...(data.name ? { name: data.name } : {}),
        ...(isEmail ? { email: data.identifier } : { phone: data.identifier }),
      };
      const response = await apiClient.post('auth/merchant/register', payload);
      return response.data;
      */
      const mockUser = {
        id: 2,
        name: data.name || 'Merchant Owner',
        phone: data.identifier,
        email: data.identifier.includes('@') ? data.identifier : 'owner@revia.com',
        role: 'merchant',
        has_business: false
      };
      return {
        data: {
          token: 'mock-merchant-register-token',
          user: mockUser
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
    }
  }
);`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('authSlice.ts updated');
}

// 3. Update LoginPage.tsx
{
  const filePath = path.join(__dirname, 'src', 'pages', 'LoginPage.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // Comment out auth/check
  content = content.replace(
    /await apiClient\.post\('auth\/check', \{ identifier: phone \}\);/g,
    `// Commented out API check for direct offline access\n                    // await apiClient.post('auth/check', { identifier: phone });`
  );

  // If password login, set mock token
  content = content.replace(
    /\/\/ Password login could be dispatched here if implemented\r?\n\s*onLoginSuccess\('merchant'\);/,
    `localStorage.setItem('token', 'mock-merchant-token');\n                    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Merchant Admin', phone, email: phone.includes('@') ? phone : 'admin@revia.com', role: 'merchant' }));\n                    onLoginSuccess('merchant');`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('LoginPage.tsx updated');
}

// 4. Update OnboardingPage.tsx
{
  const filePath = path.join(__dirname, 'src', 'pages', 'OnboardingPage.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // Provide initial mock categories
  content = content.replace(
    /const \[categories, setCategories\] = useState<\{ id: number, name: string \}\[\]>\(\[\]\);/,
    `const [categories, setCategories] = useState<{ id: number, name: string }[]>([
    { id: 1, name: 'Restaurant & Café' },
    { id: 2, name: 'Retail & Fashion' },
    { id: 3, name: 'Salon, Spa & Wellness' },
    { id: 4, name: 'Grocery & Supermarket' },
    { id: 5, name: 'Electronics & Gadgets' },
    { id: 6, name: 'Services & Entertainment' },
  ]);`
  );

  // Comment out business-categories call
  content = content.replace(
    /const response = await apiClient\.get\('\/business-categories'\);[\s\S]*?if \(Array\.isArray\(data\)\) \{[\s\S]*?setCategories\(data\);[\s\S]*?\}/,
    `// Commented out API for direct offline access\n        // const response = await apiClient.get('/business-categories');\n        // const data = response.data?.data || response.data;\n        // if (Array.isArray(data)) setCategories(data);`
  );

  // Add demo OTP display in Identity Verification popup for easy copy/testing
  if (!content.includes('Test OTP (Demo Mode)')) {
    content = content.replace(
      /(\s*<div className="flex justify-between items-center mb-6">\r?\n\s*<span className="text-\[10px\])/,
      `
                    <div className="mb-4 p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-blue-700 font-bold uppercase tracking-wider">Test OTP (Demo Mode)</p>
                        <p className="text-sm font-mono font-bold text-blue-900 tracking-widest">123456</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtp('123456')}
                        className="text-[10px] bg-white border border-blue-200 text-blue-700 font-bold px-2 py-1 rounded hover:bg-blue-50 cursor-pointer"
                      >
                        Auto-Fill
                      </button>
                    </div>$1`
    );
  }

  // Also add a "Skip Verification (Demo Mode)" option on the verification modal
  if (!content.includes('Skip for now')) {
    content = content.replace(
      /(<div className="px-6 py-5 border-b border-\[#E5E0D8\] flex justify-between items-start">[\s\S]*?<p className="text-xs text-\[#6E6A66\] mt-1">Verify your phone or email to begin onboarding\.<\/p>\s*<\/div>)/,
      `$1\n              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    dispatch(registerMerchant({ identifier: mobileNumber || '9999999999', otp: '123456' }));
                  }}
                  className="text-[11px] font-bold text-[#B8860B] hover:underline cursor-pointer bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200"
                >
                  ⚡ Skip for now
                </button>
              </div>`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('OnboardingPage.tsx updated');
}

// 5. Update onboardingSlice.ts
{
  const filePath = path.join(__dirname, 'src', 'store', 'slices', 'onboardingSlice.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /const response = await apiClient\.post\('merchant\/business\/onboard', payload\);[\s\S]*?return response\.data;/,
    `// Commented out API for direct offline access\n      // const response = await apiClient.post('merchant/business/onboard', payload);\n      // return response.data;\n      return { success: true, message: 'Onboarded successfully' };`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('onboardingSlice.ts updated');
}

// 6. Update customerAuthSlice.ts
{
  const filePath = path.join(__dirname, 'src', 'store', 'slices', 'customerAuthSlice.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  // requestCustomerOtp
  content = content.replace(
    /const response = await apiClient\.post\('\/customer\/auth\/request-otp', data\);[\s\S]*?return response\.data;/,
    `// Commented out API for direct offline access\n      // const response = await apiClient.post('/customer/auth/request-otp', data);\n      return { data: { otp: '123456' }, success: true };`
  );

  // verifyCustomerOtp
  content = content.replace(
    /const response = await apiClient\.post\('\/customer\/auth\/verify-otp', data\);[\s\S]*?const token = response\.data\?\.data\?\.token \|\| response\.data\?\.token;[\s\S]*?if \(token\) \{[\s\S]*?localStorage\.setItem\('customer_token', token\);[\s\S]*?\}[\s\S]*?return response\.data;/,
    `// Commented out API for direct offline access\n      // const response = await apiClient.post('/customer/auth/verify-otp', data);\n      const token = 'mock-customer-token';\n      localStorage.setItem('customer_token', token);\n      return { data: { token }, token, success: true };`
  );

  // saveCustomerProfile
  content = content.replace(
    /const response = await apiClient\.post\('\/customer\/profile', payload, config\);[\s\S]*?return response\.data;/,
    `// Commented out API for direct offline access\n      // const response = await apiClient.post('/customer/profile', payload, config);\n      return { success: true, message: 'Customer profile saved successfully' };`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('customerAuthSlice.ts updated');
}

