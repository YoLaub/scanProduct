Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#scanner'),
        constraints: {
          facingMode: "environment" // Utilise la caméra arrière
        }
      },
      decoder: {
        readers: ["ean_reader", "code_128_reader"] // Supporte EAN et Code128
      }
    },
    function (err) {
      if (err) {
        console.error("Erreur lors de l'initialisation :", err);
        return;
      }
      console.log("Quagga initialisé avec succès");
      Quagga.start(); // Démarre le scanner
    }
  );

  // Événement : Détection d'un code-barre
  Quagga.onDetected(function (data) {
    const code = data.codeResult.code;
    console.log("Code-barre détecté :", code);
    document.querySelector('#barcode-result').textContent = "Code-barre détecté : " + code;
    Quagga.stop(); // Arrête le scanner après la détection
  });