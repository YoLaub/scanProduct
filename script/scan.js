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
    document.querySelector('#barcode-result').textContent = code;
    Quagga.stop(); // Arrête le scanner après la détection
  });

  
const fetchProductDetails = async (barcode) => {
  const apiUrl = `https://world.openfoodfacts.net/api/v2/product/${barcode}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Erreur : ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 1) {
      // Produit trouvé
      console.log("Détails du produit :", data.product);
      displayProductDetails(data.product);
    } else {
      // Produit non trouvé
      console.log("Produit non trouvé");
      alert("Aucun produit trouvé pour ce code-barres.");
    }
  } catch (error) {
    console.error("Erreur lors de la requête :", error);
  }
};

const displayProductDetails = (product) => {
  // Exemple d'affichage dans la console
  console.log("Nom :", product.product_name);
  console.log("Marque :", product.brands);
  console.log("Ingrédients :", product.ingredients_text);
  console.log("Nutriments :", product.nutriments);
  console.log("Image :", product.image_url);

  // Exemple d'affichage HTML
  document.body.innerHTML = `
    <h1>${product.product_name || "Nom non disponible"}</h1>
    <p><strong>Marque :</strong> ${product.brands || "Non disponible"}</p>
    <p><strong>Ingrédients :</strong> ${product.ingredients_text || "Non disponible"}</p>
    <p><strong>Valeurs nutritionnelles :</strong></p>
    <ul>
      <li>Énergie : ${product.nutriments["energy-kcal"] || "N/A"} kcal</li>
      <li>Protéines : ${product.nutriments.proteins || "N/A"} g</li>
      <li>Glucides : ${product.nutriments.carbohydrates || "N/A"} g</li>
      <li>Lipides : ${product.nutriments.fat || "N/A"} g</li>
    </ul>
    <img src="${product.image_url || ''}" alt="${product.product_name}" style="max-width: 300px;">
  `;
};





  const barcode = document.querySelector('#barcode-result').textContent; // Exemple : Nutella
  fetchProductDetails(barcode);