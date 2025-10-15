
         function convertDecimalToBinary() {
            const decimal = document.getElementById('decimalInput').value;
            if (isNaN(decimal) || decimal < 0 || decimal > 255) {
                document.getElementById('decimalToBinaryOutput').innerHTML = 'Error: Masukkan angka desimal antara 0-255.';
                return;
            }
            const binary = parseInt(decimal).toString(2).padStart(8, '0');  // Pastikan 8 bit untuk IP
            document.getElementById('decimalToBinaryOutput').innerHTML = 'Hasil: ' + binary;
        }
        
        function convertBinaryToDecimal() {
            const binary = document.getElementById('binaryInput').value;
            if (!/^[01]+$/.test(binary)) {  // Validasi hanya 0 dan 1
                document.getElementById('binaryToDecimalOutput').innerHTML = 'Error: Masukkan string biner yang valid (hanya 0 dan 1).';
                return;
            }
            const decimal = parseInt(binary, 2);
            document.getElementById('binaryToDecimalOutput').innerHTML = 'Hasil: ' + decimal;
        }
        
        function calculateCIDR() {
            const ipInput = document.getElementById('ipInput').value;
            const cidrInput = document.getElementById('cidrInput').value;
            const outputDiv = document.getElementById('outputResult');
            const errorDiv = document.getElementById('errorMessage');
        
           if (!isValidIP(ipInput)) {
                errorDiv.innerHTML = 'Error: Masukkan alamat IP IPv4 yang valid (contoh: 192.168.1.1).';
                outputDiv.innerHTML = '';
                return;
            }
            
            if (isNaN(cidrInput) || cidrInput < 0 || cidrInput > 32) {
                errorDiv.innerHTML = 'Error: Nilai CIDR harus antara 0-32.';
                outputDiv.innerHTML = '';
                return;
            }
            
            const cidr = parseInt(cidrInput);
            const ipParts = ipInput.split('.').map(part => parseInt(part));
            const subnetMask = getSubnetMask(cidr);
            const networkAddress = getNetworkAddress(ipParts, subnetMask);
            const broadcastAddress = getBroadcastAddress(ipParts, subnetMask);
            const numberOfHosts = calculateNumberOfHosts(cidr);
            
            outputDiv.innerHTML = `
                <p><strong>Subnet Mask (CIDR /${cidr}):</strong> ${subnetMask.join('.')}</p>
                <p><strong>Alamat Network:</strong> ${networkAddress.join('.')}</p>
                <p><strong>Alamat Broadcast:</strong> ${broadcastAddress.join('.')}</p>
                <p><strong>Jumlah Host Tersedia:</strong> ${numberOfHosts}</p>
            `;
            errorDiv.innerHTML = '';  // Clear error if successful
        }
        
        function isValidIP(ip) {
            const parts = ip.split('.');
            if (parts.length !== 4) return false;
            for (let part of parts) {
                if (isNaN(part) || part < 0 || part > 255) return false;
            }
            return true;
        }
        
        function getSubnetMask(cidr) {
            const mask = Array(4).fill(0);
            let index = 0;
            for (let i = 0; i < cidr; i++) {
                if (i < 8) mask[0] |= (1 << (7 - (i % 8)));
                else if (i < 16) mask[1] |= (1 << (7 - ((i - 8) % 8)));
                else if (i < 24) mask[2] |= (1 << (7 - ((i - 16) % 8)));
                else mask[3] |= (1 << (7 - ((i - 24) % 8)));
            }
            return mask;
        }
        
        function getNetworkAddress(ipParts, subnetMask) {
            return ipParts.map((part, index) => part & subnetMask[index]);
        }
        
        function getBroadcastAddress(ipParts, subnetMask) {
            const invertedMask = subnetMask.map(part => 255 - part);
            return ipParts.map((part, index) => part | invertedMask[index]);
        }
        
        function calculateNumberOfHosts(cidr) {
            if (cidr === 32) return 1;  // Hanya satu host
            if (cidr === 31) return 2;  // Dua host (tanpa broadcast)
            return Math.pow(2, 32 - cidr) - 2;  // Kurangi network dan broadcast address
        }