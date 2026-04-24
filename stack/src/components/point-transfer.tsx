import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosinstance";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

/*  PointTransfer component enables users to send points to another user account.
 It manages recipient and amount inputs, validates them, and communicates with the backend via an API call to perform the transfer.
 Success and error messages are displayed to the user. The state updates reset the form and provide clear status messages after each transfer attempt.
  */

export default function PointTransfer() {
  const { t } = useTranslation();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;


  const handleTransfer = async () => {
    if (!recipient || amount <= 0) {
      setMessage("Please enter a valid recipient and amount.");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/answer/transfer", {
        recipientId: recipient, 
        amount,
      });

      setMessage(data.message || "Points transferred successfully!");
      setRecipient("");
      setAmount(0);
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || "Transfer failed.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-bold mb-3">{t("transferPoints")}</h2>

      <div className="flex flex-col gap-2">
        {/* Recipient search (by ID or email) */}
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder={t("recipient")}
          className="border p-2 rounded"
        />

        {/* Amount */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder={t("amount")}
          className="border p-2 rounded"
        />

        {/* Transfer button */}
        <Button
          onClick={handleTransfer}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {t("transfer")}
        </Button>
      </div>

      {/* Status message */}
      {message && (
        <p className="mt-3 text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}
