// src/app/request-demo/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  CheckCircle,
  Building,
  Mail,
  Phone,
  Users,
  MessageSquare,
  ArrowLeft,
  Sparkles,
  Calendar,
  Zap,
  Shield,
} from "lucide-react";

import TextField from "@/shared/components/atoms/TextField";
import Button from "@/shared/components/atoms/Button/Button";
import Select from "@/shared/components/atoms/Select";

const demoRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  phone: z.string().optional(),
  companySize: z.string().optional(),
  message: z.string().optional(),
});

type DemoRequestFormData = z.infer<typeof demoRequestSchema>;

export default function RequestDemoPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DemoRequestFormData>({
    resolver: zodResolver(demoRequestSchema),
  });

  //   const submitDemoRequest = api.admin.marketing.submitDemoRequest.useMutation({
  //     onSuccess: () => {
  //       setShowSuccess(true);
  //       reset();
  //       setTimeout(() => {
  //         router.push("/request-demo/thank-you");
  //       }, 3000);
  //     },
  //     onError: (error) => {
  //       alert(`Error: ${error.message}`);
  //     },
  //   });

  const onSubmit = (data: DemoRequestFormData) => {
    console.log("data", data);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="relative">
          {/* Background glow */}
          <div className="absolute -inset-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-3xl"></div>

          <div className="relative max-w-md w-full text-center bg-slate-900/90 border border-slate-700/50 rounded-3xl p-12 backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 shadow-lg shadow-green-500/50">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Request Received!
            </h1>
            <p className="text-slate-400 mb-8 text-lg">
              Thanks for your interest in Elaview. We'll reach out within 24
              hours to schedule your demo.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium border border-slate-700"
              >
                Back to Home
              </button>
              <button
                onClick={() => router.push("/browse")}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all font-medium shadow-lg hover:shadow-blue-500/50"
              >
                Browse Spaces
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Back Arrow */}
        <div className="relative max-w-4xl mx-auto mb-8">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-semibold">
              Get Started Today
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              See Elaview in Action
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Schedule a personalized demo to learn how Elaview can transform your
            out-of-home advertising strategy.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative">
          {/* Background glow */}
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl"></div>

          <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 rounded-3xl p-8 lg:p-12 backdrop-blur-xl shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">
                Request Your Demo
              </h2>
              <p className="text-slate-400">
                Fill out the form below and we'll be in touch within 24 hours
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <TextField
                  {...register("name")}
                  icon={Users}
                  label="Full Name*"
                  htmlFor="name"
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  errorMessage={errors.name?.message}
                />
                <TextField
                  {...register("email")}
                  icon={Mail}
                  label="Work Email *"
                  htmlFor="email"
                  type="email"
                  id="email"
                  placeholder="john@company.com"
                  errorMessage={errors.email?.message}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <TextField
                  {...register("company")}
                  icon={Building}
                  label="Company Name *"
                  htmlFor="company"
                  type="text"
                  id="company"
                  placeholder="Your Company Inc."
                  errorMessage={errors.company?.message}
                />

                {/* Phone */}
                <TextField
                  {...register("phone")}
                  icon={Phone}
                  label="Phone Number"
                  htmlFor="company"
                  type="tel"
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <Select
                {...register("companySize")}
                id="companySize"
                htmlFor="companySize"
                label="Company Size"
                options={[
                  { value: "1-10", label: "1-10 employees" },
                  { value: "11-50", label: "11-50 employees" },
                  { value: "51-200", label: "51-200 employees" },
                  { value: "201-500", label: "201-500 employees" },
                  { value: "500+", label: "500+ employees" },
                ]}
                placeholder="Select company size"
                errorMessage={errors.companySize?.message}
              />
              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-slate-300 mb-2"
                >
                  Tell us about your advertising goals
                </label>
                <div className="relative group">
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <textarea
                    {...register("message")}
                    id="message"
                    rows={4}
                    placeholder="What are you looking to accomplish with out-of-home advertising?"
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                // disabled={isSubmitting || submitDemoRequest.isPending}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  // {isSubmitting || submitDemoRequest.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="h-5 w-5" />
                    <span>Schedule Your Demo</span>
                  </>
                )}
              </Button>

              <p className="text-sm text-slate-400 text-center flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-slate-500" />
                We'll get back to you within 24 hours
              </p>
            </form>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Calendar,
              title: "Personalized Tour",
              description:
                "See how Elaview works for your specific business needs",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: Zap,
              title: "No Commitment",
              description:
                "Just a friendly conversation about your advertising goals",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: CheckCircle,
              title: "Expert Guidance",
              description:
                "Learn best practices for local advertising campaigns",
              gradient: "from-green-500 to-emerald-500",
            },
          ].map((benefit, i) => (
            <div key={i} className="group text-center">
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${benefit.gradient} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <benefit.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
