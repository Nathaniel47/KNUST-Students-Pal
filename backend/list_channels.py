from telethon.sync import TelegramClient

api_id = '29454147'
api_hash = 'acc291a2543feea255af6149cad9f78b'

client = TelegramClient('session', api_id, api_hash)
client.start()

for dialog in client.iter_dialogs():
    print(f"{dialog.name}: {dialog.id}")
