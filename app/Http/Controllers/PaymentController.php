<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $billingCycle = request()->input('billingCycle', 'monthly');
        $planId = request()->input('planId', 1);
        $plan = Plan::with('features')->findOrFail($planId);

        return Inertia::render('dashboard/payment/index', [
            'plan' => $plan,
            'billingCycle' => $billingCycle,
        ]);
    }

    public function success(){
        return Inertia::render('dashboard/payment/success');
    }

    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'planId' => 'required|integer',
            'billingCycle' => 'required|string',
            'payment_method' => 'required|in:card,sbp',
        ]);

        $user = Auth::user();

        if ($validated['planId'] === 1) {
            $user->update([
                'plan_id' => $validated['planId'],
            ]);

            return redirect()->route('payment.success');
        }

        if ($validated['payment_method'] === 'card') {
            $user->update([
                'plan_id' => $validated['planId'],
            ]);

            Payment::create([
                'user_id' => $user->id,
                'plan_id' => $validated['planId'],
                'payment_method' => 'card',
                'status' => 'paid',
            ]);

            return redirect()->route('payment.success');
        } else {
            $payment = Payment::create([
                'user_id' => $user->id,
                'plan_id' => $validated['planId'],
                'payment_method' => 'sbp',
                'status' => 'pending',
            ]);

            return redirect()->route('sbp.payment', ['payment' => $payment->id]);
        }
    }

    public function sbpPayment(Payment $payment)
    {
        $userId = Auth::id();
        if ($userId !== $payment->user_id) {
            abort(403);
        }

        $qrCodeUrl = route('sbp.payment.confirm', ['payment' => $payment->id]);
        $plan = Plan::findOrFail($payment->plan_id);

        return Inertia::render('dashboard/payment/sbp-payment', [
            'payment' => $payment,
            'qrCodeUrl' => $qrCodeUrl,
            'plan' => $plan,
        ]);
    }

    public function confirmSbpPayment(Payment $payment)
    {
        if ($payment->status === 'paid') {
            return redirect()->route('dashboard');
        }

        Auth::user()->update([
            'plan_id' => $payment->plan_id,
        ]);

        $payment->update([
            'status' => 'paid',
        ]);

        return redirect()->route('payment.success');
    }
}
