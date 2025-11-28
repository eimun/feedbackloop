import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { contractABI, contractAddress } from "@/lib/contract"

export interface FeedbackData {
  feedbackCount: number
  averageRating: number
}

export interface FeedbackState {
  isLoading: boolean
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash: `0x${string}` | undefined
  error: Error | null
}

export interface FeedbackActions {
  submitFeedback: (comment: string, rating: number) => Promise<void>
}

export const useFeedbackContract = () => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [feedbackCount, setFeedbackCount] = useState(0)
  const [averageRating, setAverageRating] = useState(0)

  // Read feedback count
  const { data: countData, refetch: refetchCount } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getFeedbackCount",
  })

  // Read average rating
  const { data: avgData, refetch: refetchAvg } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getAverageRating",
  })

  const { writeContractAsync, data: hash, error, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (countData !== undefined) setFeedbackCount(Number(countData))
    if (avgData !== undefined) setAverageRating(Number(avgData))
  }, [countData, avgData])

  useEffect(() => {
    if (isConfirmed) {
      refetchCount()
      refetchAvg()
    }
  }, [isConfirmed, refetchCount, refetchAvg])

  const submitFeedback = async (comment: string, rating: number) => {
    if (!comment || !rating) return
    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "submitFeedback",
        args: [comment, rating],
      })
    } catch (err) {
      console.error("Error submitting feedback:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const data: FeedbackData = {
    feedbackCount,
    averageRating,
  }

  const actions: FeedbackActions = {
    submitFeedback,
  }

  const state: FeedbackState = {
    isLoading: isLoading || isPending || isConfirming,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  }

  return { data, actions, state }
}
