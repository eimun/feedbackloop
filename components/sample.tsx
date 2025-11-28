// components/sample.tsx
"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useFeedbackContract } from "../hooks/useFeedbackContract"

const SampleIntegration = () => {
  const { isConnected } = useAccount()
  const [rating, setRating] = useState("5")
  const [comment, setComment] = useState("")

  const { data, actions, state } = useFeedbackContract()

  const handleSubmitFeedback = async () => {
    const ratingValue = Number(rating)
    const trimmedComment = comment.trim()

    if (!trimmedComment || Number.isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) return

    try {
      await actions.submitFeedback(trimmedComment, ratingValue)
      setComment("")
      setRating("5")
    } catch (err) {
      console.error("Error:", err)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-foreground mb-3">Feedback Contract</h2>
          <p className="text-muted-foreground">Please connect your wallet to interact with the contract.</p>
        </div>
      </div>
    )
  }

  const numericRating = Number(rating || 0)
  const isRatingValid =
    !Number.isNaN(numericRating) && Number.isInteger(numericRating) && numericRating >= 1 && numericRating <= 5
  const canSubmit = isRatingValid && comment.trim().length > 0

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">On-Chain Feedback</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Rate your experience and store feedback immutably on the Flare Coston2 network.
          </p>
        </div>

        {/* Contract Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Average Rating</p>
            <p className="text-2xl font-semibold text-foreground">
              {data.feedbackCount > 0 ? `${data.averageRating.toFixed(2)} / 5` : "No ratings yet"}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Total Feedback</p>
            <p className="text-2xl font-semibold text-foreground">{data.feedbackCount}</p>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="space-y-6">
          {/* Step 1: Choose Rating */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                1
              </span>
              <label className="block text-sm font-medium text-foreground">Select Rating (1–5)</label>
            </div>
            <input
              type="number"
              min={1}
              max={5}
              step={1}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {rating !== "" && !isRatingValid && (
              <p className="text-xs text-destructive mt-1">Rating must be an integer between 1 and 5.</p>
            )}
          </div>

          {/* Step 2: Write Comment */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                2
              </span>
              <label className="block text-sm font-medium text-foreground">Write Your Feedback</label>
            </div>
            <textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitFeedback}
            disabled={state.isLoading || state.isPending || !canSubmit}
            className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {state.isLoading || state.isPending ? "Submitting Feedback..." : "Submit Feedback"}
          </button>
        </div>

        {/* Status Messages */}
        {state.hash && (
          <div className="mt-6 p-4 bg-card border border-border rounded-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Transaction Hash</p>
            <p className="text-sm font-mono text-foreground break-all mb-3">{state.hash}</p>
            {state.isConfirming && <p className="text-sm text-primary">Waiting for confirmation...</p>}
            {state.isConfirmed && <p className="text-sm text-green-500">Transaction confirmed!</p>}
          </div>
        )}

        {state.error && (
          <div className="mt-6 p-4 bg-card border border-destructive rounded-lg">
            <p className="text-sm text-destructive-foreground">Error: {state.error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SampleIntegration