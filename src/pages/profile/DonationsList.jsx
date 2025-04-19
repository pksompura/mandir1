import React from "react";
import { Download } from "lucide-react";
import html2pdf from "html2pdf.js";

const DonationsList = ({ userDonations }) => {
  const generateDonationReceipt = (donation, userDonations) => {
    const amount =
      donation.total_amount?.$numberDecimal || donation.total_amount;

    const receiptHTML = `
      <div id="receipt" style="font-family: Arial, sans-serif; padding: 30px; max-width: 800px; margin: auto; border: 1px solid #ccc; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);">
      <!-- Logo & Title -->
<div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
  <img src="/giveaze2.png" alt="Giveaze Logo" width="120" style="margin-bottom: 10px; display: block;" />
  <h2 style="font-size: 26px; color: #333; margin-bottom: 5px;">Donation Receipt</h2>
</div>
        <!-- Acknowledgment Message -->
        <div style="margin-top: 30px; text-align: center;">
          <p style="font-size: 16px; font-style: italic; color: #444;">
            We acknowledge with gratitude the generous donation of 
            <strong>₹${amount}</strong> 
            (<strong>Rupees ${convertNumberToWords(amount)}</strong>) 
            received from <strong>${userDonations?.full_name}</strong> 
            (<strong>${userDonations?.email}</strong>). 
            This contribution was made through 
            <a href="https://giveaze.com" style="color: #007BFF;" target="_blank">Giveaze</a>, 
            in support of the campaign titled "<strong>${
              donation?.donation_campaign_id?.campaign_title
            }</strong>".
          </p>
        </div>
        <!-- Two Column Section -->
<div style="display: flex; gap: 40px; margin-top: 20px;">

  <!-- Left Column - Donation Details -->
  <div style="flex: 1;">
    <h3 style="font-size: 18px; color: #222; margin-bottom: 12px;">Donation Details</h3>

    <p style="margin: 6px 0;"><span style="color: #555;">Transaction ID:</span> <span style="color: grey;">${
      donation.transaction_id
    }</span></p>
    <p style="margin: 6px 0;"><span style="color: #555;">Campaign ID:</span> <span style="color: grey;">${
      donation?.donation_campaign_id?._id
    }</span></p>
    <p style="margin: 6px 0;"><span style="color: #555;">Amount Donated:</span> <span style="color: grey;">₹${amount}</span></p>
    <p style="margin: 6px 0;"><span style="color: #555;">Status:</span> <span style="color: grey;">${
      donation.payment_status
    }</span></p>
    <p style="margin: 6px 0;"><span style="color: #555;">Date:</span> <span style="color: grey;">${new Date(
      donation.donated_date
    ).toLocaleDateString()}</span></p>
  </div>

  <!-- Right Column - Donor Info -->
  <div style="flex: 1;">
    <h3 style="font-size: 18px; color: #222; margin-bottom: 12px;">Donor Information</h3>

    <p style="margin: 6px 0;"><span style="color: #555;">Name:</span> <span style="color: grey;">${
      userDonations?.full_name
    }</span></p>
    <p style="margin: 6px 0;"><span style="color: #555;">Email:</span> <span style="color: grey;">${
      userDonations?.email
    }</span></p>
    <p style="margin: 6px 0;"><span style="color: #555;">Phone:</span> <span style="color: grey;">${
      userDonations?.mobile_number
    }</span></p>
  </div>

</div>

        <!-- Footer -->
        <div style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px;">
          <h4 style="font-size: 16px; color: #333;">Giveaze Foundation</h4>
          <p style="font-size: 14px; color: #555; margin: 5px 0;">MPC1705, Parkwest, Hosakere Road, Binnypet, Bangalore - 560023</p>
          <p style="font-size: 14px; color: #555; margin: 5px 0;"><strong>Email:</strong> info@giveaze.com</p>
          <p style="font-size: 14px; color: #555;"><strong>Website:</strong> <a href="https://giveaze.com" target="_blank" style="color: #007BFF;">www.giveaze.com</a></p>
  
          <p style="margin-top: 20px; font-size: 12px; text-align: center; color: #999;">
            <em>This receipt is for acknowledgment purposes only. For official tax exemption documents, please contact us at <a href="mailto:info@giveaze.com">info@giveaze.com</a>.</em>
          </p>
        </div>
      </div>
    `;

    // Create temporary DOM to render and convert to PDF
    const receiptContainer = document.createElement("div");
    receiptContainer.innerHTML = receiptHTML;
    document.body.appendChild(receiptContainer);

    const element = receiptContainer.querySelector("#receipt");

    const options = {
      margin: 0.5,
      filename: `Receipt_${donation.transaction_id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        document.body.removeChild(receiptContainer);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Donations</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userDonations?.donations?.length > 0 ? (
          userDonations?.donations?.map((donation) => (
            <div
              key={donation?._id}
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
            >
              <h3 className="text-lg font-semibold">
                Campaign: {donation?.donation_campaign_id?._id}
              </h3>
              <p className="text-gray-700">
                Transaction ID: {donation.transaction_id}
              </p>
              <p className="text-gray-700">
                Amount: ₹{donation.total_amount.$numberDecimal}
              </p>
              <p className="text-gray-500 text-sm">
                Date: {new Date(donation.donated_date).toLocaleDateString()}
              </p>

              <span
                className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-lg text-white 
                  ${
                    donation.payment_status === "successful"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
              >
                {donation.payment_status.toUpperCase()}
              </span>

              {/* Spacing between badge and button */}
              <div className="mt-4">
                <button
                  onClick={() =>
                    generateDonationReceipt(donation, userDonations)
                  }
                  className="flex items-center gap-2 mt-2 text-blue-600 hover:underline"
                >
                  <Download size={16} /> Download Receipt
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No donations found.</p>
        )}
      </div>
    </div>
  );
};

export default DonationsList;

function convertNumberToWords(amount) {
  // You can replace this with a library like 'number-to-words' for better accuracy
  const num = parseInt(amount, 10);
  if (isNaN(num)) return "";

  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (num < 20) return a[num];
  if (num < 100)
    return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
  return "Amount in words";
}
