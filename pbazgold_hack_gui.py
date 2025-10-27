import pymem
import keyboard
import time
import ctypes
import threading
import tkinter as tk
from tkinter import ttk, messagebox
import pygame
import os
from ctypes import wintypes
import requests
import json
import socket
import subprocess
import sys
import tempfile
import shutil

class PBazGoldHackGUI:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("PBazGold Hack")
        self.root.geometry("500x500")
        self.root.resizable(False, False)
        
        # Siyah tema
        self.root.configure(bg='black')
        
        # Auth sistemi
        self.auth_token = None
        self.is_logged_in = False
        self.api_url = "https://pointblank-market.onrender.com/api"  # Production
        
        # Version sistemi
        self.version = "1.0.0"
        
        # Hack objesi
        self.hack = PBazGoldHack()
        
        # Ses sistemi
        self.init_sound()
        
        # Version kontrolü
        self.check_version()
        
        # Login kontrolü
        self.check_login()
    
    def check_internet_connection(self):
        """Internet bağlantısını kontrol et"""
        try:
            socket.create_connection(("8.8.8.8", 53), timeout=3)
            return True
        except OSError:
            return False
    
    def check_version(self):
        """Versiyon kontrolü ve update"""
        try:
            print("DEBUG: Version check başlıyor...")
            response = requests.get(f"{self.api_url}/hack-version?version={self.version}", timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                print(f"DEBUG: Version check response: {data}")
                
                if data.get('needsUpdate'):
                    latest = data.get('latest', 'unknown')
                    changelog = data.get('changelog', '')
                    download_url = data.get('downloadUrl', '')
                    
                    print(f"DEBUG: Update gerekli! Latest: {latest}")
                    
                    # Update dialog göster
                    result = messagebox.askyesno(
                        "Güncelleme Mevcut!",
                        f"Yeni versiyon mevcut: {latest}\n\n{changelog}\n\nGüncellemek ister misiniz?",
                        icon='question'
                    )
                    
                    if result:
                        self.download_and_update(download_url)
                else:
                    print("DEBUG: Version güncel")
            else:
                print(f"DEBUG: Version check başarısız: {response.status_code}")
        except Exception as e:
            print(f"DEBUG: Version check hatası: {e}")
    
    def download_and_update(self, url):
        """Yeni versiyonu indir ve güncelle"""
        try:
            print(f"DEBUG: İndirme başlıyor: {url}")
            messagebox.showinfo("Güncelleme", "Güncelleme indiriliyor...")
            
            # İndirme
            response = requests.get(url, stream=True)
            response.raise_for_status()
            
            # Temp dizin
            temp_dir = tempfile.gettempdir()
            exe_path = os.path.join(temp_dir, "pbazgold_hack_update.exe")
            
            with open(exe_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            print(f"DEBUG: İndirme tamamlandı: {exe_path}")
            
            # Çalıştır ve kapat
            messagebox.showinfo("Güncelleme", "Güncelleme indirildi. Program kapanıyor...")
            
            # Yeni exe'yi çalıştır
            subprocess.Popen([exe_path])
            
            # Mevcut programı kapat
            self.root.quit()
            sys.exit(0)
            
        except Exception as e:
            print(f"DEBUG: Update hatası: {e}")
            messagebox.showerror("Hata", f"Güncelleme indirilemedi: {str(e)}")
    
    def show_login_dialog(self):
        """Login dialog göster - ana pencerede"""
        # Ana pencereyi login moduna geçir
        self.root.title("🔐 PBazGold Login")
        self.root.geometry("500x500")
        
        # Tüm widget'ları temizle
        for widget in self.root.winfo_children():
            widget.destroy()
        
        # Main frame
        main_frame = tk.Frame(self.root, bg='black', padx=30, pady=30)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title_label = tk.Label(main_frame, text="🔐 PBazGold Login", 
                              font=("Arial", 20, "bold"), 
                              fg='white', bg='black')
        title_label.pack(pady=(0, 40))
        
        # Username
        username_label = tk.Label(main_frame, text="Kullanıcı Adı:", 
                                 font=("Arial", 12), 
                                 fg='white', bg='black')
        username_label.pack(anchor='w', pady=(0, 5))
        
        self.username_entry = tk.Entry(main_frame, font=("Arial", 12), width=25)
        self.username_entry.pack(pady=(0, 20))
        self.username_entry.focus()
        
        # Password
        password_label = tk.Label(main_frame, text="Şifre:", 
                                 font=("Arial", 12), 
                                 fg='white', bg='black')
        password_label.pack(anchor='w', pady=(0, 5))
        
        self.password_entry = tk.Entry(main_frame, font=("Arial", 12), width=25, show="*")
        self.password_entry.pack(pady=(0, 30))
        
        # Status label
        self.status_label = tk.Label(main_frame, text="", 
                               font=("Arial", 10), 
                               fg='red', bg='black')
        self.status_label.pack(pady=(0, 20))
        
        # Login button
        login_button = tk.Button(main_frame, text="Giriş Yap", 
                               font=("Arial", 12, "bold"),
                               bg='#2c3e50', fg='white',
                               command=self.login, width=20)
        login_button.pack(pady=(0, 30))
        
        # Bind Enter key
        def on_enter(event):
            self.login()
        
        self.username_entry.bind('<Return>', on_enter)
        self.password_entry.bind('<Return>', on_enter)
        
        # Test bilgileri
        test_label = tk.Label(main_frame, 
                             text="Test: admin/admin123 (Aktif)\nTest: user/user123 (Pasif)", 
                             font=("Arial", 9), 
                             fg='gray', bg='black')
        test_label.pack()
    
    def login(self):
        """Login işlemi"""
        username = self.username_entry.get().strip()
        password = self.password_entry.get().strip()
        
        print(f"DEBUG: Login attempt - Username: {username}")
        
        if not username or not password:
            print("DEBUG: Username or password empty")
            self.status_label.config(text="Kullanıcı adı ve şifre gerekli!", fg='red')
            return
        
        # Internet kontrolü
        if not self.check_internet_connection():
            print("DEBUG: No internet connection")
            self.status_label.config(text="❌ Internet bağlantısı yok!", fg='red')
            return
        
        print("DEBUG: Internet connection OK")
        self.status_label.config(text="Giriş yapılıyor...", fg='yellow')
        self.root.update()
        
        # API'ye login isteği
        try:
            print(f"DEBUG: ========================================")
            print(f"DEBUG: LOGIN REQUEST DETAILS")
            print(f"DEBUG: ========================================")
            print(f"DEBUG: API URL: {self.api_url}")
            print(f"DEBUG: Full endpoint: {self.api_url}/login")
            print(f"DEBUG: Username: {username}")
            print(f"DEBUG: Password length: {len(password)}")
            print(f"DEBUG: Request payload: {{'username': '{username}', 'password': '***'}}")
            print(f"DEBUG: ========================================")
            
            response = requests.post(f"{self.api_url}/login", 
                                   json={"username": username, "password": password},
                                   timeout=10)
            
            print(f"DEBUG: ========================================")
            print(f"DEBUG: RESPONSE DETAILS")
            print(f"DEBUG: ========================================")
            print(f"DEBUG: Response status: {response.status_code}")
            print(f"DEBUG: Response headers: {dict(response.headers)}")
            print(f"DEBUG: Response content length: {len(response.content)}")
            print(f"DEBUG: ========================================")
            
            data = response.json()
            
            print(f"DEBUG: Parsed JSON data:")
            print(f"DEBUG: - success: {data.get('success')}")
            print(f"DEBUG: - message: {data.get('message')}")
            print(f"DEBUG: - token exists: {'token' in data}")
            print(f"DEBUG: - user exists: {'user' in data}")
            
            if 'user' in data:
                print(f"DEBUG: - user data: {data.get('user')}")
            
            print(f"DEBUG: ========================================")
            
            if data.get('success'):
                self.auth_token = data.get('token')
                self.is_logged_in = True
                self.current_user = data.get('user', {})
                print(f"DEBUG: ✅ LOGIN SUCCESSFUL")
                print(f"DEBUG: Token (first 30): {self.auth_token[:30]}...")
                print(f"DEBUG: User data: {self.current_user}")
                self.status_label.config(text="✅ Giriş başarılı!", fg='green')
                self.root.update()
                time.sleep(1)
                self.create_gui()
                self.setup_hotkeys()
            else:
                print(f"DEBUG: ❌ LOGIN FAILED")
                print(f"DEBUG: Reason: {data.get('message', 'Unknown error')}")
                self.status_label.config(text=f"❌ {data.get('message', 'Giriş başarısız')}", fg='red')
                
        except requests.exceptions.ConnectionError as e:
            print(f"DEBUG: Login connection error: {e}")
            self.status_label.config(text="❌ Sunucuya bağlanılamadı!", fg='red')
        except requests.exceptions.Timeout as e:
            print(f"DEBUG: Login timeout error: {e}")
            self.status_label.config(text="❌ Bağlantı zaman aşımı!", fg='red')
        except requests.exceptions.RequestException as e:
            print(f"DEBUG: Login request error: {e}")
            self.status_label.config(text="❌ İstek hatası!", fg='red')
        except Exception as e:
            print(f"DEBUG: Login unexpected error: {e}")
            print(f"DEBUG: Error type: {type(e)}")
            import traceback
            print("DEBUG: Login traceback: [Unicode error in traceback]")
            self.status_label.config(text="❌ Beklenmeyen hata!", fg='red')
    
    def check_login(self):
        """Login kontrolü yap"""
        # Internet kontrolü
        if not self.check_internet_connection():
            self.show_error_and_exit("❌ Internet bağlantısı gerekli!\nLütfen internet bağlantınızı kontrol edin.")
            return
        
        # Login dialog göster
        self.show_login_dialog()
    
    def show_error_and_exit(self, message):
        """Hata mesajı göster ve çık"""
        error_window = tk.Toplevel(self.root)
        error_window.title("Hata")
        error_window.geometry("400x200")
        error_window.resizable(False, False)
        error_window.configure(bg='black')
        error_window.grab_set()
        
        # Center the window
        error_window.transient(self.root)
        error_window.geometry("+%d+%d" % (
            self.root.winfo_rootx() + 50,
            self.root.winfo_rooty() + 100
        ))
        
        main_frame = tk.Frame(error_window, bg='black', padx=30, pady=30)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        error_label = tk.Label(main_frame, text=message, 
                              font=("Arial", 12), 
                              fg='red', bg='black',
                              justify='center')
        error_label.pack(expand=True)
        
        def close_app():
            error_window.destroy()
            self.root.quit()
        
        close_button = tk.Button(main_frame, text="Çıkış", 
                               font=("Arial", 12, "bold"),
                               bg='#e74c3c', fg='white',
                               command=close_app, width=15)
        close_button.pack(pady=(20, 0))
        
    def init_sound(self):
        """Ses sistemi başlat"""
        try:
            pygame.mixer.init()
            
            # Ses dosyalarını oluştur (basit beep sesleri)
            self.create_sound_files()
            
            # Ses dosyalarını yükle
            self.sound_on = pygame.mixer.Sound("sound_on.wav")
            self.sound_off = pygame.mixer.Sound("sound_off.wav")
            
        except Exception as e:
            self.sound_on = None
            self.sound_off = None
    
    def create_sound_files(self):
        """Basit ses dosyaları oluştur"""
        try:
            # Açık sesi (yüksek ton)
            import wave
            import numpy as np
            
            # Açık sesi (800 Hz)
            sample_rate = 44100
            duration = 0.3
            frequency = 800
            
            t = np.linspace(0, duration, int(sample_rate * duration), False)
            wave_data = np.sin(frequency * 2 * np.pi * t) * 0.3
            
            with wave.open("sound_on.wav", "w") as wav_file:
                wav_file.setnchannels(1)
                wav_file.setsampwidth(2)
                wav_file.setframerate(sample_rate)
                wav_file.writeframes((wave_data * 32767).astype(np.int16).tobytes())
            
            # Kapalı sesi (400 Hz)
            frequency = 400
            wave_data = np.sin(frequency * 2 * np.pi * t) * 0.3
            
            with wave.open("sound_off.wav", "w") as wav_file:
                wav_file.setnchannels(1)
                wav_file.setsampwidth(2)
                wav_file.setframerate(sample_rate)
                wav_file.writeframes((wave_data * 32767).astype(np.int16).tobytes())
                
        except Exception as e:
            pass
    
    def create_gui(self):
        """GUI arayüzü oluştur"""
        # Ana pencereyi hack moduna geçir
        self.root.title("🎯 PBazGold Hack")
        self.root.geometry("500x500")
        
        # Tüm widget'ları temizle
        for widget in self.root.winfo_children():
            widget.destroy()
        
        # Ana frame - siyah arka plan
        main_frame = tk.Frame(self.root, bg='black', padx=20, pady=20)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Başlık - beyaz yazı
        title_label = tk.Label(main_frame, text="🎯 PBazGold Hack", 
                             font=("Arial", 20, "bold"), 
                             fg='white', bg='black')
        title_label.pack(pady=(0, 20))
        
        # Kullanıcı bilgisi
        user_info = tk.Label(main_frame, 
                            text=f"👤 {self.current_user.get('username', 'Kullanıcı')}", 
                            font=("Arial", 12), 
                            fg='#3498db', bg='black')
        user_info.pack(pady=(0, 30))
        
        # Sekmeme durumu - büyük ve kalın
        self.sekmeme_label = tk.Label(main_frame, text="Sekmeme", 
                                    font=("Arial", 24, "bold"), 
                                    fg="red", bg='black')
        self.sekmeme_label.pack(pady=(0, 10))
        
        # Sekmeme kontrol bilgisi
        sekmeme_control_label = tk.Label(main_frame, 
                                        text="Shift + Alt + P / O", 
                                        font=("Arial", 10), 
                                        fg='gray', bg='black')
        sekmeme_control_label.pack(pady=(0, 20))
        
        # FpsMax durumu
        self.fpsmax_label = tk.Label(main_frame, text="FpsMax", 
                                    font=("Arial", 24, "bold"), 
                                    fg="red", bg='black')
        self.fpsmax_label.pack(pady=(0, 10))
        
        # FpsMax kontrol bilgisi
        fpsmax_control_label = tk.Label(main_frame, 
                                       text="Shift + Alt + F / G", 
                                       font=("Arial", 10), 
                                       fg='gray', bg='black')
        fpsmax_control_label.pack(pady=(0, 20))
        
        # WH durumu
        self.wh_label = tk.Label(main_frame, text="WH", 
                                font=("Arial", 24, "bold"), 
                                fg="red", bg='black')
        self.wh_label.pack(pady=(0, 10))
        
        # WH kontrol bilgisi
        wh_control_label = tk.Label(main_frame, 
                                   text="F1 / F2", 
                                   font=("Arial", 10), 
                                   fg='gray', bg='black')
        wh_control_label.pack(pady=(0, 30))
        
        # Abonelik bilgisi
        self.subscription_label = tk.Label(main_frame, 
                                         text="⏰ Abonelik Süresi Hesaplanıyor...", 
                                         font=("Arial", 11), 
                                         fg='#f39c12', bg='black')
        self.subscription_label.pack(pady=(0, 20))
        
        # Durum açıklaması - küçük ve gri
        self.status_label = tk.Label(main_frame, 
                                   text="Kırmızı: Deaktif | Yeşil: Aktif", 
                                   font=("Arial", 9), 
                                   fg='gray', bg='black')
        self.status_label.pack()
        
        # Abonelik süresini güncelle
        self.update_subscription_time()
    
    def update_subscription_time(self):
        """Abonelik süresini güncelle"""
        print("DEBUG: update_subscription_time called")
        try:
            if not self.auth_token:
                print("DEBUG: No auth token")
                self.subscription_label.config(text="❌ Oturum bulunamadı", fg='#e74c3c')
                return
            
            print(f"DEBUG: API URL: {self.api_url}/verify")
            print(f"DEBUG: Auth token: {self.auth_token[:20]}...")
            
            response = requests.post(f"{self.api_url}/verify", 
                                   json={"token": self.auth_token},
                                   timeout=5)
            
            print(f"DEBUG: Response status: {response.status_code}")
            print(f"DEBUG: Response headers: {dict(response.headers)}")
            
            data = response.json()
            try:
                print(f"DEBUG: Response data: {data}")
            except UnicodeEncodeError:
                print("DEBUG: Response data: [Unicode error - data received]")
            
            if data.get('success'):
                user = data.get('user', {})
                subscription_end = user.get('subscription_end')
                try:
                    print(f"DEBUG: User data: {user}")
                except UnicodeEncodeError:
                    print("DEBUG: User data: [Unicode error - user data received]")
                print(f"DEBUG: Subscription end: {subscription_end}")
                
                if subscription_end:
                    # Subscription end tarihini parse et
                    from datetime import datetime, timezone
                    # Fix datetime format for parsing
                    date_str = subscription_end.replace('Z', '+00:00')
                    # Handle microseconds - add zeros if needed
                    if '.' in date_str and '+' in date_str:
                        parts = date_str.split('.')
                        if len(parts) == 2:
                            microsec_part, tz_part = parts[1].split('+')
                            if len(microsec_part) < 6:
                                microsec_part = microsec_part.ljust(6, '0')
                            date_str = f"{parts[0]}.{microsec_part}+{tz_part}"
                    
                    end_date = datetime.fromisoformat(date_str)
                    now = datetime.now(timezone.utc)
                    
                    print(f"DEBUG: End date: {end_date}")
                    print(f"DEBUG: Now: {now}")
                    
                    if end_date > now:
                        # Kalan süre hesapla
                        remaining = end_date - now
                        days = remaining.days
                        hours, remainder = divmod(remaining.seconds, 3600)
                        minutes, seconds = divmod(remainder, 60)
                        
                        print(f"DEBUG: Remaining: {days} days, {hours} hours, {minutes} minutes, {seconds} seconds")
                        
                        if days > 0:
                            time_text = f"⏰ {days} gün {hours} saat {minutes} dakika kaldı"
                        elif hours > 0:
                            time_text = f"⏰ {hours} saat {minutes} dakika {seconds} saniye kaldı"
                        elif minutes > 0:
                            time_text = f"⏰ {minutes} dakika {seconds} saniye kaldı"
                        else:
                            time_text = f"⏰ {seconds} saniye kaldı"
                        
                        try:
                            print(f"DEBUG: Time text: {time_text}")
                        except UnicodeEncodeError:
                            print("DEBUG: Time text: [Unicode error - time text generated]")
                        self.subscription_label.config(text=time_text, fg='#27ae60')
                    else:
                        print("DEBUG: Subscription expired")
                        self.subscription_label.config(text="❌ Abonelik süresi doldu!", fg='#e74c3c')
                else:
                    print("DEBUG: No subscription end date")
                    self.subscription_label.config(text="❌ Abonelik bulunamadı!", fg='#e74c3c')
            else:
                print(f"DEBUG: API returned success=False: {data.get('message', 'Unknown error')}")
                self.subscription_label.config(text="❌ Oturum geçersiz", fg='#e74c3c')
            
        except requests.exceptions.ConnectionError as e:
            print(f"DEBUG: Connection error: {e}")
            self.subscription_label.config(text="❌ Sunucuya bağlanılamadı", fg='#e74c3c')
        except requests.exceptions.Timeout as e:
            print(f"DEBUG: Timeout error: {e}")
            self.subscription_label.config(text="❌ Bağlantı zaman aşımı", fg='#e74c3c')
        except requests.exceptions.RequestException as e:
            print(f"DEBUG: Request error: {e}")
            self.subscription_label.config(text="❌ İstek hatası", fg='#e74c3c')
        except Exception as e:
            print(f"DEBUG: Unexpected error: {e}")
            print(f"DEBUG: Error type: {type(e)}")
            import traceback
            print("DEBUG: Traceback: [Unicode error in traceback]")
            self.subscription_label.config(text="❌ Beklenmeyen hata", fg='#e74c3c')
        
        # Her 1 saniyede bir güncelle (gerçek zamanlı geri sayım)
        self.root.after(1000, self.update_subscription_time)
    
    def setup_hotkeys(self):
        """Hotkey sistemi kur"""
        def hotkey_listener():
            while True:
                try:
                    if keyboard.is_pressed('shift') and keyboard.is_pressed('alt') and keyboard.is_pressed('p'):
                        self.root.after(0, self.activate_hack)
                        time.sleep(0.5)
                    
                    elif keyboard.is_pressed('shift') and keyboard.is_pressed('alt') and keyboard.is_pressed('o'):
                        self.root.after(0, self.deactivate_hack)
                        time.sleep(0.5)
                    
                    elif keyboard.is_pressed('shift') and keyboard.is_pressed('alt') and keyboard.is_pressed('f'):
                        print("DEBUG: Shift+Alt+F basıldı")
                        self.root.after(0, self.activate_fpsmax)
                        time.sleep(0.5)
                    
                    elif keyboard.is_pressed('shift') and keyboard.is_pressed('alt') and keyboard.is_pressed('g'):
                        print("DEBUG: Shift+Alt+G basıldı")
                        self.root.after(0, self.deactivate_fpsmax)
                        time.sleep(0.5)
                    
                    elif keyboard.is_pressed('f1'):
                        print("DEBUG: F1 basıldı")
                        self.root.after(0, self.activate_wh)
                        time.sleep(0.5)
                    
                    elif keyboard.is_pressed('f2'):
                        print("DEBUG: F2 basıldı")
                        self.root.after(0, self.deactivate_wh)
                        time.sleep(0.5)
                    
                    time.sleep(0.01)
                    
                except Exception as e:
                    time.sleep(0.1)
        
        # Hotkey thread'i başlat
        hotkey_thread = threading.Thread(target=hotkey_listener, daemon=True)
        hotkey_thread.start()
    
    def verify_auth(self):
        """Auth token'ı doğrula"""
        if not self.auth_token:
            return False
        
        try:
            response = requests.post(f"{self.api_url}/verify", 
                                   json={"token": self.auth_token},
                                   timeout=5)
            data = response.json()
            return data.get('success', False)
        except:
            return False
    
    def check_subscription_valid(self):
        """Abonelik geçerliliğini kontrol et"""
        try:
            if not self.auth_token:
                return False, "Oturum bulunamadı"
            
            response = requests.post(f"{self.api_url}/verify", 
                                   json={"token": self.auth_token},
                                   timeout=5)
            data = response.json()
            
            if data.get('success'):
                user = data.get('user', {})
                
                # Kullanıcı aktif mi kontrol et
                is_active = user.get('is_active', 0)
                if not is_active:
                    return False, "Hesabınız pasif durumda! Admin ile iletişime geçin."
                
                subscription_end = user.get('subscription_end')
                
                if subscription_end:
                    from datetime import datetime, timezone
                    
                    # Fix datetime format for parsing
                    date_str = subscription_end.replace('Z', '+00:00')
                    # Handle microseconds - add zeros if needed
                    if '.' in date_str and '+' in date_str:
                        parts = date_str.split('.')
                        if len(parts) == 2:
                            microsec_part, tz_part = parts[1].split('+')
                            if len(microsec_part) < 6:
                                microsec_part = microsec_part.ljust(6, '0')
                            date_str = f"{parts[0]}.{microsec_part}+{tz_part}"
                    
                    end_date = datetime.fromisoformat(date_str)
                    now = datetime.now(timezone.utc)
                    
                    if end_date > now:
                        return True, "Abonelik aktif"
                    else:
                        return False, "Abonelik süreniz dolmuş! Ödeme yapın."
                else:
                    return False, "Aboneliğiniz bulunamadı! Ödeme yapın."
            else:
                return False, "Oturum geçersiz"
        except Exception as e:
            return False, "Bağlantı hatası"
    
    def activate_hack(self):
        """Hack'i aktif et"""
        if self.hack.is_active:
            return
        
        # Abonelik kontrolü
        is_valid, error_message = self.check_subscription_valid()
        if not is_valid:
            self.status_label.config(text=f"❌ {error_message}", fg='red')
            return
        
        # Auth kontrolü
        if not self.verify_auth():
            self.show_error_and_exit("❌ Oturum süresi doldu!\nLütfen tekrar giriş yapın.")
            return
        
        # Hack'i aktif et
        self.hack.enable_hack()
        
        if self.hack.is_active:
            self.sekmeme_label.config(fg="green")
            
            # Ses çal
            if self.sound_on:
                try:
                    self.sound_on.play()
                except:
                    pass
    
    def deactivate_hack(self):
        """Hack'i deaktif et"""
        if not self.hack.is_active:
            return
        
        # Hack'i deaktif et
        self.hack.disable_hack()
        
        if not self.hack.is_active:
            self.sekmeme_label.config(fg="red")
            
            # Ses çal
            if self.sound_off:
                try:
                    self.sound_off.play()
                except:
                    pass
    
    def activate_fpsmax(self):
        """FpsMax'i aktif et"""
        print("DEBUG: activate_fpsmax çağrıldı")
        if self.hack.fpsmax_active:
            print("DEBUG: FpsMax zaten aktif")
            return
        
        # Abonelik kontrolü
        is_valid, error_message = self.check_subscription_valid()
        if not is_valid:
            self.status_label.config(text=f"❌ {error_message}", fg='red')
            return
        
        # Auth kontrolü
        if not self.verify_auth():
            self.show_error_and_exit("❌ Oturum süresi doldu!\nLütfen tekrar giriş yapın.")
            return
        
        print("DEBUG: FpsMax aktif ediliyor...")
        # FpsMax'i aktif et
        result = self.hack.enable_fpsmax()
        print(f"DEBUG: enable_fpsmax sonucu: {result}")
        
        if self.hack.fpsmax_active:
            print("DEBUG: FpsMax başarıyla aktif edildi")
            self.fpsmax_label.config(fg="green")
            
            # Ses çal
            if self.sound_on:
                try:
                    self.sound_on.play()
                except:
                    pass
        else:
            print("DEBUG: FpsMax aktif edilemedi")
    
    def deactivate_fpsmax(self):
        """FpsMax'i deaktif et"""
        print("DEBUG: deactivate_fpsmax çağrıldı")
        if not self.hack.fpsmax_active:
            print("DEBUG: FpsMax zaten deaktif")
            return
        
        print("DEBUG: FpsMax deaktif ediliyor...")
        # FpsMax'i deaktif et
        result = self.hack.disable_fpsmax()
        print(f"DEBUG: disable_fpsmax sonucu: {result}")
        
        if not self.hack.fpsmax_active:
            print("DEBUG: FpsMax başarıyla deaktif edildi")
            self.fpsmax_label.config(fg="red")
            
            # Ses çal
            if self.sound_off:
                try:
                    self.sound_off.play()
                except:
                    pass
        else:
            print("DEBUG: FpsMax deaktif edilemedi")
    
    def activate_wh(self):
        """WH'yi aktif et"""
        print("DEBUG: activate_wh çağrıldı")
        if self.hack.wh_active:
            print("DEBUG: WH zaten aktif")
            return
        
        # Abonelik kontrolü
        is_valid, error_message = self.check_subscription_valid()
        if not is_valid:
            self.status_label.config(text=f"❌ {error_message}", fg='red')
            return
        
        # Auth kontrolü
        if not self.verify_auth():
            self.show_error_and_exit("❌ Oturum süresi doldu!\nLütfen tekrar giriş yapın.")
            return
        
        print("DEBUG: WH aktif ediliyor...")
        # WH'yi aktif et
        result = self.hack.enable_wh()
        print(f"DEBUG: enable_wh sonucu: {result}")
        
        if result:
            print("DEBUG: WH başarıyla aktif edildi")
            self.hack.wh_active = True
            self.wh_label.config(fg="green")
            
            # Ses çal
            if self.sound_on:
                try:
                    self.sound_on.play()
                except:
                    pass
        else:
            print("DEBUG: WH aktif edilemedi")
    
    def deactivate_wh(self):
        """WH'yi deaktif et"""
        print("DEBUG: deactivate_wh çağrıldı")
        if not self.hack.wh_active:
            print("DEBUG: WH zaten deaktif")
            return
        
        print("DEBUG: WH deaktif ediliyor...")
        # WH'yi deaktif et
        result = self.hack.disable_wh()
        print(f"DEBUG: disable_wh sonucu: {result}")
        
        if result:
            print("DEBUG: WH başarıyla deaktif edildi")
            self.hack.wh_active = False
            self.wh_label.config(fg="red")
            
            # Ses çal
            if self.sound_off:
                try:
                    self.sound_off.play()
                except:
                    pass
        else:
            print("DEBUG: WH deaktif edilemedi")
    
    def exit_program(self):
        """Programdan çık"""
        if self.hack.is_active:
            self.hack.disable_hack()
        
        if self.hack.fpsmax_active:
            self.hack.disable_fpsmax()
        
        if self.hack.wh_active:
            self.hack.disable_wh()
        
        # Ses dosyalarını temizle
        try:
            if os.path.exists("sound_on.wav"):
                os.remove("sound_on.wav")
            if os.path.exists("sound_off.wav"):
                os.remove("sound_off.wav")
        except:
            pass
        
        self.root.quit()
        self.root.destroy()
    
    def run(self):
        """GUI'yi başlat"""
        self.root.protocol("WM_DELETE_WINDOW", self.exit_program)
        self.root.mainloop()

class PBazGoldHack:
    def __init__(self):
        self.process = None
        self.process_handle = None
        self.allocated_memory = None
        self.is_active = False
        
        # FpsMax için
        self.fpsmax_active = False
        self.fpsmax_address = None
        self.fpsmax_original_value = None
        
        # WH özelliği
        self.wh_active = False
        self.wh_addresses = []  # 16 adres için liste
        self.wh_original_values = []  # 16 orijinal değer için liste
        self.wh_toggle_threads = []  # 16 thread için liste
        self.wh_stop_toggle = False
        
        # Cheat Engine scriptindeki adresler
        self.target_address = 0x4BE079  # "pbazgold.exe"+4BE079
        self.jump_address = 0x4BE232    # pbazgold.exe+4BE232
        
        # DISABLE kısmındaki original bytes
        # db 84 C0 0F 84 B1 01 00 00 = test al,al + je pbazgold.exe+4BE232
        self.original_bytes = bytes([0x84, 0xC0, 0x0F, 0x84, 0xB1, 0x01, 0x00, 0x00])
        
    def find_process(self):
        """pbazgold.exe processini bul"""
        try:
            self.process = pymem.Pymem("pbazgold.exe")
            self.process_handle = self.process.process_handle
            
            # Base address'i al
            self.base_address = self.process.base_address
            self.real_target_address = self.base_address + self.target_address
            
            return True
        except Exception as e:
            return False
    
    def allocate_memory(self):
        """2048 byte memory allocate et (ENABLE kısmındaki alloc)"""
        try:
            kernel32 = ctypes.windll.kernel32
            
            # MEM_COMMIT | MEM_RESERVE
            allocation_type = 0x1000 | 0x2000
            # PAGE_EXECUTE_READWRITE
            protection = 0x40
            
            self.allocated_memory = kernel32.VirtualAllocEx(
                self.process_handle,
                None,
                2048,  # alloc(newmem,2048)
                allocation_type,
                protection
            )
            
            if self.allocated_memory:
                return True
            else:
                return False
                
        except Exception as e:
            return False
    
    def write_hook_code(self):
        """Hook kodunu yaz (ENABLE kısmındaki newmem kodu)"""
        try:
            # Cheat Engine scriptindeki assembly kodunu Python'a çevir
            hook_code = bytearray()
            
            # newmem: mov al,(float)0
            hook_code.extend([0xB0, 0x00])  # mov al, 0
            
            # originalcode: test al,al
            hook_code.extend([0x84, 0xC0])  # test al,al
            
            # je pbazgold.exe+4BE232
            # Jump offset hesapla
            current_pos = self.allocated_memory + len(hook_code)
            real_jump_address = self.base_address + self.jump_address
            jump_offset = real_jump_address - (current_pos + 6)  # je komutu 6 byte
            
            hook_code.extend([0x0F, 0x84])  # je
            hook_code.extend(jump_offset.to_bytes(4, 'little', signed=True))
            
            # exit: jmp returnhere
            return_offset = (self.real_target_address + 8) - (self.allocated_memory + len(hook_code) + 5)
            hook_code.extend([0xE9])  # jmp
            hook_code.extend(return_offset.to_bytes(4, 'little', signed=True))
            
            # Hook kodunu memory'e yaz
            bytes_written = ctypes.c_size_t()
            kernel32 = ctypes.windll.kernel32
            
            result = kernel32.WriteProcessMemory(
                self.process_handle,
                self.allocated_memory,
                bytes(hook_code),
                len(hook_code),
                ctypes.byref(bytes_written)
            )
            
            if result and bytes_written.value == len(hook_code):
                return True
            else:
                return False
                
        except Exception as e:
            return False
    
    def install_hook(self):
        """Hook'u kur (ENABLE kısmındaki jmp newmem)"""
        try:
            # Jump offset hesapla (allocated memory'e)
            jump_offset = self.allocated_memory - (self.real_target_address + 5)
            
            # Hook bytes: jmp newmem + nop 3
            hook_bytes = bytearray([0xE9])  # jmp
            hook_bytes.extend(jump_offset.to_bytes(4, 'little', signed=True))
            hook_bytes.extend([0x90, 0x90, 0x90])  # nop 3
            
            # Hook'u yaz
            bytes_written = ctypes.c_size_t()
            kernel32 = ctypes.windll.kernel32
            
            result = kernel32.WriteProcessMemory(
                self.process_handle,
                self.real_target_address,
                bytes(hook_bytes),
                len(hook_bytes),
                ctypes.byref(bytes_written)
            )
            
            if result and bytes_written.value == len(hook_bytes):
                return True
            else:
                return False
                
        except Exception as e:
            return False
    
    def remove_hook(self):
        """Hook'u kaldır (DISABLE kısmındaki db değerleri)"""
        try:
            bytes_written = ctypes.c_size_t()
            kernel32 = ctypes.windll.kernel32
            
            result = kernel32.WriteProcessMemory(
                self.process_handle,
                self.real_target_address,
                self.original_bytes,
                len(self.original_bytes),
                ctypes.byref(bytes_written)
            )
            
            if result and bytes_written.value == len(self.original_bytes):
                return True
            else:
                return False
                
        except Exception as e:
            return False
    
    def deallocate_memory(self):
        """Memory'i serbest bırak (DISABLE kısmındaki dealloc)"""
        try:
            if self.allocated_memory:
                kernel32 = ctypes.windll.kernel32
                result = kernel32.VirtualFreeEx(
                    self.process_handle,
                    self.allocated_memory,
                    0,
                    0x8000  # MEM_RELEASE
                )
                
                if result:
                    self.allocated_memory = None
                    return True
                else:
                    return False
            return True
            
        except Exception as e:
            return False
    
    def enable_hack(self):
        """Hack'i aktif et (ENABLE kısmı)"""
        if self.is_active:
            return
        
        if not self.find_process():
            return
        
        if not self.allocate_memory():
            return
        
        if not self.write_hook_code():
            self.deallocate_memory()
            return
        
        if not self.install_hook():
            self.deallocate_memory()
            return
        
        self.is_active = True
    
    def disable_hack(self):
        """Hack'i deaktif et (DISABLE kısmı)"""
        if not self.is_active:
            return
        
        if not self.find_process():
            return
        
        if not self.remove_hook():
            return
        
        if not self.deallocate_memory():
            return
        
        self.is_active = False
    
    def find_fpsmax_address(self):
        """FpsMax adresini bul (THREADSTACK0-00000D44)"""
        print("DEBUG: find_fpsmax_address çağrıldı")
        try:
            if not self.process:
                print("DEBUG: Process bulunamadı")
                return False
            
            print("DEBUG: Modüller listeleniyor...")
            # THREADSTACK0 modülünü bul
            modules = list(self.process.list_modules())
            print(f"DEBUG: {len(modules)} modül bulundu")
            
            threadstack_base = None
            for module in modules:
                # MODULEINFO objesinin attribute'larını kontrol et
                print(f"DEBUG: Modül: {module.name}")
                print(f"DEBUG: Module attributes: {dir(module)}")
                
                # Farklı attribute'ları dene
                base_addr = None
                if hasattr(module, 'base_address'):
                    base_addr = module.base_address
                elif hasattr(module, 'base'):
                    base_addr = module.base
                elif hasattr(module, 'lpBaseOfDll'):
                    base_addr = module.lpBaseOfDll
                elif hasattr(module, 'baseaddr'):
                    base_addr = module.baseaddr
                
                if base_addr:
                    print(f"DEBUG: Base address: 0x{base_addr:X}")
                    # pbazgold.exe modülünü ara
                    if "pbazgold.exe" in module.name.lower():
                        threadstack_base = base_addr
                        print(f"DEBUG: pbazgold.exe modülü bulundu: {module.name} - 0x{threadstack_base:X}")
                        break
                else:
                    print(f"DEBUG: Base address bulunamadı")
            
            if not threadstack_base:
                print("DEBUG: pbazgold.exe modülü bulunamadı")
                return False
            
            # Resimdeki pointer chain: pbazgold.exe+00F57F8C → pointer → +5C → final address
            intermediate_address = threadstack_base + 0x00F57F8C
            print(f"DEBUG: Intermediate adres (pbazgold.exe+00F57F8C): 0x{intermediate_address:X}")
            
            # Intermediate adresten değeri oku (pointer)
            kernel32 = ctypes.windll.kernel32
            buffer = ctypes.create_string_buffer(4)
            bytes_read = ctypes.c_size_t()
            
            result = kernel32.ReadProcessMemory(
                self.process_handle,
                intermediate_address,
                buffer,
                4,
                ctypes.byref(bytes_read)
            )
            
            if not result or bytes_read.value != 4:
                print(f"DEBUG: Intermediate adres okunamadı: result={result}, bytes_read={bytes_read.value}")
                return False
            
            # Pointer değerini al
            pointer_value = int.from_bytes(buffer.raw, 'little')
            print(f"DEBUG: Pointer değeri: 0x{pointer_value:X}")
            
            # Final adres: pointer + 5C
            self.fpsmax_address = pointer_value + 0x5C
            print(f"DEBUG: Final FpsMax adresi: 0x{self.fpsmax_address:X}")
            
            # Orijinal değeri oku
            kernel32 = ctypes.windll.kernel32
            buffer = ctypes.create_string_buffer(4)
            bytes_read = ctypes.c_size_t()
            
            result = kernel32.ReadProcessMemory(
                self.process_handle,
                self.fpsmax_address,
                buffer,
                4,
                ctypes.byref(bytes_read)
            )
            
            if result and bytes_read.value == 4:
                self.fpsmax_original_value = int.from_bytes(buffer.raw, 'little')
                print(f"DEBUG: Orijinal değer okundu: {self.fpsmax_original_value}")
                return True
            else:
                print(f"DEBUG: Memory okuma başarısız: result={result}, bytes_read={bytes_read.value}")
                return False
            
        except Exception as e:
            print(f"DEBUG: find_fpsmax_address hatası: {e}")
            return False
    
    def enable_fpsmax(self):
        """FpsMax'i aktif et (999 yaz)"""
        print("DEBUG: enable_fpsmax çağrıldı")
        if self.fpsmax_active:
            print("DEBUG: FpsMax zaten aktif")
            return True
        
        if not self.find_process():
            print("DEBUG: Process bulunamadı")
            return False
        
        if not self.find_fpsmax_address():
            print("DEBUG: FpsMax adresi bulunamadı")
            return False
        
        try:
            print("DEBUG: 999 değeri yazılıyor...")
            # 999 değerini 4 byte olarak yaz
            kernel32 = ctypes.windll.kernel32
            bytes_written = ctypes.c_size_t()
            
            value_bytes = (999).to_bytes(4, 'little')
            print(f"DEBUG: Yazılacak bytes: {value_bytes.hex()}")
            
            result = kernel32.WriteProcessMemory(
                self.process_handle,
                self.fpsmax_address,
                value_bytes,
                4,
                ctypes.byref(bytes_written)
            )
            
            print(f"DEBUG: WriteProcessMemory sonucu: result={result}, bytes_written={bytes_written.value}")
            
            if result and bytes_written.value == 4:
                self.fpsmax_active = True
                print("DEBUG: FpsMax başarıyla aktif edildi")
                return True
            
            print("DEBUG: FpsMax aktif edilemedi")
            return False
            
        except Exception as e:
            print(f"DEBUG: enable_fpsmax hatası: {e}")
            return False
    
    def disable_fpsmax(self):
        """FpsMax'i deaktif et (orijinal değeri geri yaz)"""
        print("DEBUG: disable_fpsmax çağrıldı")
        if not self.fpsmax_active:
            print("DEBUG: FpsMax zaten deaktif")
            return True
        
        if not self.find_process():
            print("DEBUG: Process bulunamadı")
            return False
        
        if not self.fpsmax_address or self.fpsmax_original_value is None:
            print("DEBUG: FpsMax adresi veya orijinal değer bulunamadı")
            return False
        
        try:
            print("DEBUG: Orijinal değer geri yazılıyor...")
            # Orijinal değeri geri yaz
            kernel32 = ctypes.windll.kernel32
            bytes_written = ctypes.c_size_t()
            
            original_bytes = self.fpsmax_original_value.to_bytes(4, 'little')
            print(f"DEBUG: Geri yazılacak bytes: {original_bytes.hex()}")
            
            result = kernel32.WriteProcessMemory(
                self.process_handle,
                self.fpsmax_address,
                original_bytes,
                4,
                ctypes.byref(bytes_written)
            )
            
            print(f"DEBUG: WriteProcessMemory sonucu: result={result}, bytes_written={bytes_written.value}")
            
            if result and bytes_written.value == 4:
                self.fpsmax_active = False
                print("DEBUG: FpsMax başarıyla deaktif edildi")
                return True
            
            print("DEBUG: FpsMax deaktif edilemedi")
            return False
            
        except Exception as e:
            print(f"DEBUG: disable_fpsmax hatası: {e}")
            return False
    
    def find_wh_addresses(self):
        """WH için 2 adresi bul - iki farklı pointer chain ile"""
        try:
            if not self.process:
                print("DEBUG: Process bulunamadı")
                return False
            
            print("DEBUG: WH adresleri bulunuyor...")
            modules = list(self.process.list_modules())
            
            pbazgold_base = None
            for module in modules:
                if hasattr(module, 'lpBaseOfDll'):
                    base_addr = module.lpBaseOfDll
                    if "pbazgold.exe" in module.name.lower():
                        pbazgold_base = base_addr
                        print(f"DEBUG: pbazgold.exe modülü bulundu: 0x{pbazgold_base:X}")
                        break
            
            if not pbazgold_base:
                print("DEBUG: pbazgold.exe modülü bulunamadı")
                return False
            
            kernel32 = ctypes.windll.kernel32
            self.wh_addresses = []
            self.wh_original_values = []
            
            # 16 farklı pointer chain
            wh_chains = [
                # İlk grup: pbazgold.exe+00F7DB38 chain'leri
                {"base_offset": 0x00F7DB38, "offsets": [0x18, 0x94, 0x120, 0x40, 0x6B8]},  # WH1
                {"base_offset": 0x00F7DB38, "offsets": [0x18, 0x94, 0x120, 0x40, 0x6C8]},  # WH2
                {"base_offset": 0x00F7DB38, "offsets": [0x18, 0x94, 0x120, 0x40, 0x6D8]},  # WH3
                {"base_offset": 0x00F7DB38, "offsets": [0x18, 0x94, 0x120, 0x40, 0x6E8]},  # WH4
                {"base_offset": 0x00F7DB38, "offsets": [0x18, 0x94, 0x120, 0x40, 0x6F8]},  # WH5
                {"base_offset": 0x00F7DB38, "offsets": [0x18, 0x94, 0x120, 0x40, 0x708]},  # WH6
                {"base_offset": 0x00F7DB38, "offsets": [0x18, 0x94, 0x120, 0x40, 0x718]},  # WH7
                {"base_offset": 0x00F7DB38, "offsets": [0x18, 0x94, 0x120, 0x40, 0x728]},  # WH8
                
                # İkinci grup: pbazgold.exe+00F7DBC8 chain'leri
                {"base_offset": 0x00F7DBC8, "offsets": [0x18, 0x18, 0x20, 0x6B0]},  # WH9
                {"base_offset": 0x00F7DBC8, "offsets": [0x18, 0x18, 0x20, 0x6C0]},  # WH10
                {"base_offset": 0x00F7DBC8, "offsets": [0x18, 0x18, 0x20, 0x6D0]},  # WH11
                {"base_offset": 0x00F7DBC8, "offsets": [0x18, 0x18, 0x20, 0x6E0]},  # WH12
                {"base_offset": 0x00F7DBC8, "offsets": [0x18, 0x18, 0x20, 0x6F0]},  # WH13
                {"base_offset": 0x00F7DBC8, "offsets": [0x18, 0x18, 0x20, 0x700]},  # WH14
                {"base_offset": 0x00F7DBC8, "offsets": [0x18, 0x18, 0x20, 0x710]},  # WH15
                {"base_offset": 0x00F7DBC8, "offsets": [0x18, 0x18, 0x20, 0x720]}   # WH16
            ]
            
            for i, chain in enumerate(wh_chains):
                print(f"DEBUG: WH {i+1} chain işleniyor...")
                
                # Base adres
                current_addr = pbazgold_base + chain["base_offset"]
                print(f"DEBUG: WH {i+1} - Base: 0x{current_addr:X}")
                
                # Pointer chain'i takip et
                for j, offset in enumerate(chain["offsets"]):
                    # Pointer değerini oku
                    buffer = ctypes.create_string_buffer(4)
                    bytes_read = ctypes.c_size_t()
                    
                    result = kernel32.ReadProcessMemory(
                        self.process_handle,
                        current_addr,
                        buffer,
                        4,
                        ctypes.byref(bytes_read)
                    )
                    
                    if not result or bytes_read.value != 4:
                        print(f"DEBUG: WH {i+1} - Step {j+2} okunamadı: 0x{current_addr:X}")
                        break
                    
                    pointer_value = int.from_bytes(buffer.raw, 'little')
                    print(f"DEBUG: WH {i+1} - Step {j+2}: 0x{current_addr:X} -> 0x{pointer_value:X}")
                    
                    # Son offset değilse pointer değerine git
                    if j < len(chain["offsets"]) - 1:
                        current_addr = pointer_value + offset
                    else:
                        # Son adım: final adres
                        final_addr = pointer_value + offset
                        print(f"DEBUG: WH {i+1} - Final adres: 0x{final_addr:X}")
                        
                        # Orijinal değeri oku
                        buffer = ctypes.create_string_buffer(4)
                        bytes_read = ctypes.c_size_t()
                        
                        result = kernel32.ReadProcessMemory(
                            self.process_handle,
                            final_addr,
                            buffer,
                            4,
                            ctypes.byref(bytes_read)
                        )
                        
                        if result and bytes_read.value == 4:
                            self.wh_addresses.append(final_addr)
                            self.wh_original_values.append(buffer.raw)
                            original_value = int.from_bytes(buffer.raw, 'little')
                            print(f"DEBUG: WH {i+1} hazır: 0x{final_addr:X} = {original_value}")
                        else:
                            print(f"DEBUG: WH {i+1} final değer okunamadı")
                        break
            
            print(f"DEBUG: {len(self.wh_addresses)} WH adresi bulundu")
            return len(self.wh_addresses) > 0
            
        except Exception as e:
            print(f"DEBUG: find_wh_addresses hatası: {e}")
            return False
    
    def wh_toggle_loop(self, addr_index):
        """WH toggle döngüsü - belirli bir adres için 1ms 256, 1ms 0"""
        print(f"DEBUG: WH {addr_index+1} toggle döngüsü başladı")
        kernel32 = ctypes.windll.kernel32
        addr = self.wh_addresses[addr_index]
        
        while not self.wh_stop_toggle:
            try:
                # 256 yaz
                value_256 = (256).to_bytes(4, 'little')
                bytes_written = ctypes.c_size_t()
                
                kernel32.WriteProcessMemory(
                    self.process_handle,
                    addr,
                    value_256,
                    4,
                    ctypes.byref(bytes_written)
                )
                
                time.sleep(0.001)  # 1ms bekle
                
                if self.wh_stop_toggle:
                    break
                
                # 0 yaz
                value_0 = (0).to_bytes(4, 'little')
                bytes_written = ctypes.c_size_t()
                
                kernel32.WriteProcessMemory(
                    self.process_handle,
                    addr,
                    value_0,
                    4,
                    ctypes.byref(bytes_written)
                )
                
                time.sleep(0.001)  # 1ms bekle
                
            except Exception as e:
                print(f"DEBUG: WH {addr_index+1} toggle hatası: {e}")
                break
        
        print(f"DEBUG: WH {addr_index+1} toggle döngüsü durdu")
    
    def enable_wh(self):
        """WH'yi aktif et - 16 adres için sürekli toggle"""
        print("DEBUG: enable_wh çağrıldı")
        try:
            if not self.find_process():
                print("DEBUG: Process bulunamadı")
                return False
            
            if not self.find_wh_addresses():
                print("DEBUG: WH adresleri bulunamadı")
                return False
            
            # Her adres için toggle thread'i başlat
            self.wh_stop_toggle = False
            self.wh_toggle_threads = []
            
            for i in range(len(self.wh_addresses)):
                thread = threading.Thread(target=self.wh_toggle_loop, args=(i,), daemon=True)
                thread.start()
                self.wh_toggle_threads.append(thread)
                print(f"DEBUG: WH {i+1} toggle thread başlatıldı")
            
            print(f"DEBUG: {len(self.wh_addresses)} WH toggle başlatıldı")
            return True
            
        except Exception as e:
            print(f"DEBUG: enable_wh hatası: {e}")
            return False
    
    def disable_wh(self):
        """WH'yi deaktif et - toggle'ları durdur ve orijinal değerleri geri yaz"""
        print("DEBUG: disable_wh çağrıldı")
        try:
            if not self.find_process():
                print("DEBUG: Process bulunamadı")
                return False
            
            # Toggle'ları durdur
            self.wh_stop_toggle = True
            
            # Thread'lerin bitmesini bekle
            for i, thread in enumerate(self.wh_toggle_threads):
                if thread and thread.is_alive():
                    thread.join(timeout=1.0)
                    print(f"DEBUG: WH {i+1} thread durdu")
            
            # Orijinal değerleri geri yaz
            kernel32 = ctypes.windll.kernel32
            success_count = 0
            
            for i, addr in enumerate(self.wh_addresses):
                if i < len(self.wh_original_values):
                    bytes_written = ctypes.c_size_t()
                    
                    result = kernel32.WriteProcessMemory(
                        self.process_handle,
                        addr,
                        self.wh_original_values[i],
                        4,
                        ctypes.byref(bytes_written)
                    )
                    
                    if result and bytes_written.value == 4:
                        original_value = int.from_bytes(self.wh_original_values[i], 'little')
                        print(f"DEBUG: WH {i+1} deaktif: 0x{addr:X} = {original_value}")
                        success_count += 1
                    else:
                        print(f"DEBUG: WH {i+1} geri yazılamadı: 0x{addr:X}")
            
            print(f"DEBUG: {success_count}/{len(self.wh_addresses)} WH adresi deaktif edildi")
            return True
            
        except Exception as e:
            print(f"DEBUG: disable_wh hatası: {e}")
            return False

if __name__ == "__main__":
    # Gerekli kütüphaneleri kontrol et
    try:
        import pymem
        import keyboard
        import pygame
        import numpy
        import requests
    except ImportError as e:
        print(f"Gerekli kütüphane eksik: {e}")
        print("pip install pymem keyboard pygame numpy requests")
        exit(1)
    
    # Admin yetkisi kontrolü
    try:
        is_admin = ctypes.windll.shell32.IsUserAnAdmin()
        if not is_admin:
            print("⚠️  Uyarı: Admin yetkisi gerekli!")
    except:
        pass
    
    # GUI'yi başlat
    app = PBazGoldHackGUI()
    app.run()