<?php

/*
 * Deploys QIT Docs.
 */

if ( empty( getenv( 'DEPLOY_ENDPOINT' ) ) ) {
	throw new RuntimeException( "Missing required environment variable: DEPLOY_ENDPOINT" );
}

if ( empty( getenv( 'DOCS_SECRET' ) ) ) {
	throw new RuntimeException( "Missing required environment variable: DOCS_SECRET" );
}

if ( empty( getenv( 'FILE' ) ) ) {
	throw new RuntimeException( "Missing required environment variable: FILE" );
}

if ( ! file_exists( getenv( 'FILE' ) ) ) {
	throw new RuntimeException( sprintf( "File %s does not exist", getenv( 'FILE' ) ) );
}

$file = new SplFileObject( getenv( 'FILE' ) );

$chunk_size_kb = 5120;
$current_chunk = 0;
$cd_upload_id  = wp_generate_uuid4();
$expected_size = $file->getSize();

while ( $file->valid() ) {
	$current_chunk ++;
	$curl = curl_init();
	curl_setopt_array( $curl, [
		CURLOPT_URL            => getenv( 'DEPLOY_ENDPOINT' ),
		CURLOPT_POST           => true,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_HEADER         => true,
		// Unproxied because we are deploying from GitHub, not local.
		// CURLOPT_PROXY          => 'host.docker.internal:8080',
		// CURLOPT_PROXYTYPE      => CURLPROXY_SOCKS5,
		CURLOPT_POSTFIELDS     => [
			'docs_upload_id' => $cd_upload_id,
			'current_chunk'  => $current_chunk,
			'expected_size'  => $expected_size,
			'total_chunks'   => ceil( $file->getSize() / ( $chunk_size_kb * 1024 ) ),
			'chunk'          => base64_encode( $file->fread( $chunk_size_kb * 1024 ) ),
			'docs_secret'    => getenv( 'DOCS_SECRET' ),
		]
	] );
	$result = curl_exec( $curl );

	echo sprintf( "(Local) Sending chunk %d\n", $current_chunk );

	// Get curl body:
	echo sprintf( "(Remote) %d: %s\n", curl_getinfo( $curl, CURLINFO_HTTP_CODE ), substr( $result, curl_getinfo( $curl, CURLINFO_HEADER_SIZE ) ) );

	if ( curl_getinfo( $curl, CURLINFO_HTTP_CODE ) !== 200 ) {
		echo sprintf( "Could not upload the deploy.\nResponse status codes: %s (Expected 200)\nResponse body: %s\nCurl Error: %s\n", curl_getinfo( $curl, CURLINFO_HTTP_CODE ), $result, curl_error( $curl ) );
		exit( 1 );
	}

	curl_close( $curl );
}

/** Porting wp_generate_uuid4 from Core */
function wp_generate_uuid4() {
	return sprintf(
		'%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
		mt_rand( 0, 0xffff ),
		mt_rand( 0, 0xffff ),
		mt_rand( 0, 0xffff ),
		mt_rand( 0, 0x0fff ) | 0x4000,
		mt_rand( 0, 0x3fff ) | 0x8000,
		mt_rand( 0, 0xffff ),
		mt_rand( 0, 0xffff ),
		mt_rand( 0, 0xffff )
	);
}