import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendLowStockAlert(
  itemName: string,
  currentQty: number,
  unit: string,
  threshold: number
) {
  const html = `
    <div style="font-family:sans-serif; max-width:560px; margin:0 auto; color:#1A1A1A;">

      <!-- Header -->
      <div style="background:#1B3A5C; padding:20px 28px; border-bottom:3px solid #B83232;">
        <p style="margin:0; font-size:18px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#ffffff;">
          Make No Sense
        </p>
        <p style="margin:4px 0 0; font-size:12px; color:rgba(255,255,255,0.5); letter-spacing:.06em; text-transform:uppercase;">
          Nashville Food Truck
        </p>
      </div>

      <!-- Alert body -->
      <div style="padding:32px 28px; background:#f9f8f6; border:1px solid #e5e2dc; border-top:none;">
        <p style="display:inline-block; background:#B83232; color:#fff; font-size:11px; font-weight:700;
                  letter-spacing:.08em; text-transform:uppercase; padding:4px 10px; margin:0 0 20px; border-radius:4px;">
          ⚠️ Low Stock Alert
        </p>

        <h1 style="margin:0 0 8px; font-size:24px; font-weight:700; color:#1B3A5C;">
          ${itemName}
        </h1>
        <p style="margin:0 0 28px; font-size:14px; color:#666;">
          This inventory item has fallen to or below its reorder threshold.
        </p>

        <table style="width:100%; border-collapse:collapse; background:#fff;
                      border:1px solid #e5e2dc; border-radius:8px; overflow:hidden;">
          <tr style="background:#1B3A5C;">
            <th style="padding:10px 16px; text-align:left; font-size:11px; font-weight:700;
                       letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,0.6);">
              Field
            </th>
            <th style="padding:10px 16px; text-align:right; font-size:11px; font-weight:700;
                       letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,0.6);">
              Value
            </th>
          </tr>
          <tr style="border-bottom:1px solid #e5e2dc;">
            <td style="padding:12px 16px; font-size:13px; color:#555;">Current Quantity</td>
            <td style="padding:12px 16px; font-size:13px; font-weight:700; color:#B83232; text-align:right; font-family:monospace;">
              ${currentQty} ${unit}
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px; font-size:13px; color:#555;">Reorder Threshold</td>
            <td style="padding:12px 16px; font-size:13px; color:#1B3A5C; text-align:right; font-family:monospace;">
              ${threshold} ${unit}
            </td>
          </tr>
        </table>

        <p style="margin:24px 0 0; padding:16px; background:#fffbeb; border:1px solid #f0c060;
                  border-radius:6px; font-size:13px; color:#7a5a00;">
          Consider placing a purchase order soon to avoid running out at your next event.
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:16px 28px; background:#fff; border:1px solid #e5e2dc; border-top:none;
                  display:flex; justify-content:space-between; align-items:center;">
        <p style="margin:0; font-size:12px; color:#aaa;">
          Make No Sense inventory alert
        </p>
        <a href="https://makenosense.info/admin/stock"
           style="font-size:12px; color:#B83232; text-decoration:none; font-weight:600;">
          View Stock Levels →
        </a>
      </div>

    </div>
  `

  await resend.emails.send({
    from: 'alerts@makenosense.info',
    to: ['natoya@makenosense.info'],
    subject: `⚠️ Low Stock Alert — ${itemName}`,
    html,
  })
}
