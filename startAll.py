import subprocess
import threading
import os

def run_program(command):
    try:
        result = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        while True:
            output = result.stdout.readline()
            if output == b'' and result.poll() is not None:
                break
            if output:
                print(output.strip().decode())
        rc = result.poll()
        return rc
    except Exception as e:
        print(f"Error running command {command}: {e}")

def kill_process_using_port(port):
    try:
        command = f"netstat -ano | findstr :{port}"
        result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output = result.stdout.decode()
        if output:
            pid = int(output.strip().split()[-1])
            kill_command = f"taskkill /PID {pid} /F"
            subprocess.run(kill_command, shell=True)
        else:
            print(f"No process found using port {port}")
    except Exception as e:
        print(f"Error finding/killing process on port {port}: {e}")

def main():
    os.environ['MONGO_URI'] = ''

    ports = {
        'Python': 5000,
        'Node.js': 5001,
        'React': 3000  
    }

    for port in ports.values():
        kill_process_using_port(port)

    commands = {
        'Python': "py utility-functions\\playerDataSendOver.py",
        'Node.js': "node backend\\server.js",
        'React': "cd loi-frontend-web && npm start"
    }

    threads = []
    for name, command in commands.items():
        print(f"Starting {name} server on port {ports[name]}")
        thread = threading.Thread(target=run_program, args=(command,))
        thread.start()
        threads.append(thread)
    
    for thread in threads:
        thread.join()

if __name__ == "__main__":
    main()
