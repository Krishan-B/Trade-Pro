import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/lib/countries';
import { logDuplicateKeys } from '@/lib/devUtils';

interface Props {
  email: string;
  setEmail: (value: string) => void;
  countryCode: string;
  setCountryCode: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  fieldErrors: Record<string, string>;
}

const RegistrationStepContact: React.FC<Props> = ({
  email,
  setEmail,
  countryCode,
  setCountryCode,
  phoneNumber,
  setPhoneNumber,
  fieldErrors,
}) => {
  React.useEffect(() => {
    logDuplicateKeys(countries, (c) => c.code, 'RegistrationStepContact');
  }, []);

  const selectedCountry = countries.find((c) => c.dialCode === countryCode);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldErrors.email ? 'border-destructive' : ''}
        />
        {fieldErrors.email && <p className="text-destructive text-sm">{fieldErrors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone-number">Phone Number</Label>
        <div className="flex">
          <Select
            value={selectedCountry?.code}
            onValueChange={(value) => {
              const country = countries.find((c) => c.code === value);
              if (country) {
                setCountryCode(country.dialCode);
              }
            }}
          >
            <SelectTrigger className="w-[120px] rounded-r-none">
              <SelectValue placeholder="Code" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.dialCode} ({c.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="phone-number"
            type="tel"
            placeholder="1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={`flex-1 rounded-l-none ${fieldErrors.phoneNumber ? 'border-destructive' : ''}`}
          />
        </div>
        {fieldErrors.phoneNumber && <p className="text-destructive text-sm">{fieldErrors.phoneNumber}</p>}
      </div>
    </div>
  );
};

export default RegistrationStepContact;