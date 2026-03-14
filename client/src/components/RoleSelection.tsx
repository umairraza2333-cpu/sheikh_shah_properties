import { Users, Building2 } from 'lucide-react';

interface RoleSelectionProps {
  selectedRole: 'buyer' | 'agent' | null;
  onRoleSelect: (role: 'buyer' | 'agent') => void;
}

export default function RoleSelection({ selectedRole, onRoleSelect }: RoleSelectionProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-2">Choose Your Role</h2>
      <p className="text-muted-foreground mb-6">Select how you want to use Sheikh & Shah Properties</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Buyer Role Card */}
        <button
          onClick={() => onRoleSelect('buyer')}
          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
            selectedRole === 'buyer'
              ? 'border-accent bg-accent/10'
              : 'border-border bg-card hover:border-accent/50'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${selectedRole === 'buyer' ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
              <Users size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">I'm a Buyer</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse and search for premium properties in Karachi
              </p>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li>✓ Search properties by location & price</li>
                <li>✓ Save favorite properties</li>
                <li>✓ Contact agents directly</li>
                <li>✓ View property details & images</li>
              </ul>
            </div>
          </div>
        </button>

        {/* Agent/Seller Role Card */}
        <button
          onClick={() => onRoleSelect('agent')}
          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
            selectedRole === 'agent'
              ? 'border-accent bg-accent/10'
              : 'border-border bg-card hover:border-accent/50'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${selectedRole === 'agent' ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
              <Building2 size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">I'm an Agent / Seller</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Post and manage property listings on our platform
              </p>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li>✓ Post unlimited property listings</li>
                <li>✓ Upload multiple images per property</li>
                <li>✓ Manage your properties easily</li>
                <li>✓ 3 months free trial included</li>
              </ul>
            </div>
          </div>
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Note:</span> You can change your role later in your account settings. Agents get 3 months free trial to post properties.
        </p>
      </div>
    </div>
  );
}
