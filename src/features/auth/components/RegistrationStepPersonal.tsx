import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/lib/countries';

interface Props {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  fieldErrors: Record<string, string>;
}

const RegistrationStepPersonal: React.FC<Props> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  country,
  setCountry,
  fieldErrors,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input
            id="first-name"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={fieldErrors.firstName ? 'border-destructive' : ''}
          />
          {fieldErrors.firstName && <p className="text-destructive text-sm">{fieldErrors.firstName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input
            id="last-name"
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={fieldErrors.lastName ? 'border-destructive' : ''}
          />
          {fieldErrors.lastName && <p className="text-destructive text-sm">{fieldErrors.lastName}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger id="country" className={fieldErrors.country ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldErrors.country && <p className="text-destructive text-sm">{fieldErrors.country}</p>}
      </div>
    </div>
  );
};

export default RegistrationStepPersonal;