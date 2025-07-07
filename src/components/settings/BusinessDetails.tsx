
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Building, Phone, Mail, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BusinessDetails = () => {
  const { gymProfile, updateGymProfile } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    gym_name: '',
    gym_address: '',
    gym_phone: '',
    gym_email: '',
  });
  const [emergencyContact, setEmergencyContact] = useState('');
  const [insuranceInfo, setInsuranceInfo] = useState({
    provider: '',
    policy_number: '',
    expiry_date: '',
  });
  const [licenseInfo, setLicenseInfo] = useState({
    license_number: '',
    issuing_authority: '',
    expiry_date: '',
  });

  useEffect(() => {
    if (gymProfile) {
      setFormData({
        gym_name: gymProfile.gym_name || '',
        gym_address: gymProfile.gym_address || '',
        gym_phone: gymProfile.gym_phone || '',
        gym_email: gymProfile.gym_email || '',
      });
    }
  }, [gymProfile]);

  const handleBusinessDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await updateGymProfile(formData);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update business details",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Business details updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-800">
            <Building className="w-5 h-5 mr-2" />
            Business Information
          </CardTitle>
          <CardDescription>Update your gym's basic business information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBusinessDetailsSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gym_name">Gym Name *</Label>
                <Input
                  id="gym_name"
                  value={formData.gym_name}
                  onChange={(e) => setFormData({ ...formData, gym_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gym_email">Email</Label>
                <Input
                  id="gym_email"
                  type="email"
                  value={formData.gym_email}
                  onChange={(e) => setFormData({ ...formData, gym_email: e.target.value })}
                  placeholder="contact@yourgym.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gym_phone">Phone Number</Label>
                <Input
                  id="gym_phone"
                  value={formData.gym_phone}
                  onChange={(e) => setFormData({ ...formData, gym_phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Emergency contact number"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="gym_address">Business Address</Label>
              <Textarea
                id="gym_address"
                value={formData.gym_address}
                onChange={(e) => setFormData({ ...formData, gym_address: e.target.value })}
                placeholder="123 Fitness Street, City, State, ZIP"
                rows={3}
              />
            </div>

            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              <Save className="w-4 h-4 mr-2" />
              Save Business Details
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Insurance Information</CardTitle>
            <CardDescription>Keep track of your insurance details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="insurance_provider">Insurance Provider</Label>
              <Input
                id="insurance_provider"
                value={insuranceInfo.provider}
                onChange={(e) => setInsuranceInfo({ ...insuranceInfo, provider: e.target.value })}
                placeholder="Insurance company name"
              />
            </div>
            <div>
              <Label htmlFor="policy_number">Policy Number</Label>
              <Input
                id="policy_number"
                value={insuranceInfo.policy_number}
                onChange={(e) => setInsuranceInfo({ ...insuranceInfo, policy_number: e.target.value })}
                placeholder="Policy number"
              />
            </div>
            <div>
              <Label htmlFor="insurance_expiry">Expiry Date</Label>
              <Input
                id="insurance_expiry"
                type="date"
                value={insuranceInfo.expiry_date}
                onChange={(e) => setInsuranceInfo({ ...insuranceInfo, expiry_date: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">License Information</CardTitle>
            <CardDescription>Track your business license details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="license_number">License Number</Label>
              <Input
                id="license_number"
                value={licenseInfo.license_number}
                onChange={(e) => setLicenseInfo({ ...licenseInfo, license_number: e.target.value })}
                placeholder="Business license number"
              />
            </div>
            <div>
              <Label htmlFor="issuing_authority">Issuing Authority</Label>
              <Input
                id="issuing_authority"
                value={licenseInfo.issuing_authority}
                onChange={(e) => setLicenseInfo({ ...licenseInfo, issuing_authority: e.target.value })}
                placeholder="City/State authority"
              />
            </div>
            <div>
              <Label htmlFor="license_expiry">Expiry Date</Label>
              <Input
                id="license_expiry"
                type="date"
                value={licenseInfo.expiry_date}
                onChange={(e) => setLicenseInfo({ ...licenseInfo, expiry_date: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessDetails;
