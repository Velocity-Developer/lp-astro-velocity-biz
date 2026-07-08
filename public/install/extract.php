<?php
$zipFile = 'build.zip';
$extractTo = '../'; // Ekstrak ke folder luar install

if (!file_exists($zipFile)) {
    echo "File ZIP tidak ditemukan.";
    exit;
}

$zip = new ZipArchive;
if ($zip->open($zipFile) === TRUE) {
    $zip->extractTo($extractTo);
    $zip->close();
    echo "Ekstrak berhasil!";
    unlink($zipFile);
} else {
    echo "Gagal membuka file ZIP.";
}
