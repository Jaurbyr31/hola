<?php 

include_once '../Models/conexion.php';

$sql = "SELECT * FROM colegios";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo $row['nombreColegio'];
  }
} else {
  echo "0 results";
}
$conn->close();

?>