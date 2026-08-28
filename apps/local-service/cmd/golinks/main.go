package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"path/filepath"

	localservice "github.com/go-links/local-service"
)

var version = "dev"

func main() {
	httpListen := flag.String("http-listen", "127.0.0.1:80", "loopback HTTP address")
	httpsListen := flag.String("https-listen", "127.0.0.1:443", "loopback HTTPS address")
	dataDir := flag.String("data-dir", "/Library/Application Support/Goli", "directory for local data")
	certFile := flag.String("cert-file", "", "TLS certificate PEM file")
	keyFile := flag.String("key-file", "", "TLS private-key PEM file")
	flag.Parse()
	if *certFile == "" {
		*certFile = filepath.Join(*dataDir, "certs", "server.pem")
	}
	if *keyFile == "" {
		*keyFile = filepath.Join(*dataDir, "certs", "server-key.pem")
	}
	if err := os.MkdirAll(*dataDir, 0755); err != nil {
		log.Fatal(err)
	}
	s, err := localservice.NewWithVersion(filepath.Join(*dataDir, "links.db"), version)
	if err != nil {
		log.Fatal(err)
	}
	defer s.Close()
	if _, err := os.Stat(*certFile); err != nil {
		log.Fatalf("TLS certificate is unavailable; reinstall Goli: %v", err)
	}
	if _, err := os.Stat(*keyFile); err != nil {
		log.Fatalf("TLS private key is unavailable; reinstall Goli: %v", err)
	}
	go func() {
		log.Printf("Goli redirects HTTP on %s to HTTPS", *httpListen)
		log.Fatal(http.ListenAndServe(*httpListen, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.Redirect(w, r, "https://go.li"+r.URL.RequestURI(), http.StatusPermanentRedirect)
		})))
	}()
	log.Printf("Goli listening securely on https://%s", *httpsListen)
	log.Fatal(http.ListenAndServeTLS(*httpsListen, *certFile, *keyFile, s))
}
