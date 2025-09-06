from telethon.sync import TelegramClient

api_id = 29454147
api_hash = "acc291a2543feea255af6149cad9f78b"

with TelegramClient("session_name", api_id, api_hash) as client:
    print("\n📢 CHANNELS ONLY:\n")
    for dialog in client.iter_dialogs():
        if dialog.is_channel:  # ✅ Only channels
            name = dialog.name
            cid = dialog.id
            marker = ""

            # Highlight your target channels
            if name in ["CareerHub", "KNUST Events"]:
                marker = " ✅ (Target Channel)"

            print(f"{name} => {cid}{marker}")
