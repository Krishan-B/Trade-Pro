import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff, Check } from 'lucide-react';
import { usePasswordStrength } from '../hooks/usePasswordStrength';

interface Props {
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  agreedToTerms: boolean;
  setAgreedToTerms: (value: boolean) => void;
  agreedToPrivacy: boolean;
  setAgreedToPrivacy: (value: boolean) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  fieldErrors: Record<string, string>;
}

const RegistrationStepSecurity: React.FC<Props> = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  agreedToTerms,
  setAgreedToTerms,
  agreedToPrivacy,
  setAgreedToPrivacy,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  fieldErrors,
}) => {
  const { passwordStrength, getPasswordStrengthLabel, getPasswordStrengthColor } = usePasswordStrength(password);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldErrors.password ? 'border-destructive pr-10' : 'pr-10'}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-1"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {fieldErrors.password && <p className="text-destructive text-sm">{fieldErrors.password}</p>}
        {password && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Password strength:</span>
              <span
                className={
                  passwordStrength <= 25
                    ? 'text-destructive'
                    : passwordStrength <= 75
                    ? 'text-warning'
                    : 'text-success'
                }
              >
                {getPasswordStrengthLabel()}
              </span>
            </div>
            <Progress value={passwordStrength} className={getPasswordStrengthColor()} />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={fieldErrors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-1"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {fieldErrors.confirmPassword && (
          <p className="text-destructive text-sm">{fieldErrors.confirmPassword}</p>
        )}
        {password && confirmPassword && password === confirmPassword && (
          <div className="flex items-center text-success text-xs mt-1">
            <Check className="h-3 w-3 mr-1" /> Passwords match
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(Boolean(checked))}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the Terms and Conditions.
          </label>
        </div>
        {fieldErrors.agreedToTerms && <p className="text-destructive text-sm">{fieldErrors.agreedToTerms}</p>}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="privacy"
            checked={agreedToPrivacy}
            onCheckedChange={(checked) => setAgreedToPrivacy(Boolean(checked))}
          />
          <label
            htmlFor="privacy"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the Privacy Policy.
          </label>
        </div>
        {fieldErrors.agreedToPrivacy && (
          <p className="text-destructive text-sm">{fieldErrors.agreedToPrivacy}</p>
        )}
      </div>
    </div>
  );
};

export default RegistrationStepSecurity;